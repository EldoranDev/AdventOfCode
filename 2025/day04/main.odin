package main

import "core:simd"
import "base:intrinsics"
import "core:fmt"
import aoc "aoc:app"
import m "aoc:math"

// How many bytes/cells we process per SIMD instruction.
// 32 lanes of u8 = one 256-bit vector register (e.g. AVX2 on x86,
// or whatever the target maps 256-bit SIMD onto). If your target
// CPU doesn't have 256-bit vector units, the compiler will still
// emit *correct* code, just split into smaller ops under the hood.
LANES :: 16

Floor :: struct {
	data:   []u8, // flat, padded grid — see build_floor for the layout
	w, h:   int,  // *logical* width/height (what the puzzle input actually has)
	w_padded: int, // w rounded up to a multiple of LANES — used for the scan loop
	stride: int,  // real distance between the start of one row and the next
	              // in `data` — this is w + 2, NOT w, because of padding
}

// -----------------------------------------------------------------
// WHY PADDING?
//
// Every cell needs to look at its 8 neighbors. Cells on the edge of
// the grid have neighbors that would be "off the grid" — normally
// you'd need an `if in-bounds` check for every one of those 8 reads,
// for every cell. That branching is exactly what kills both scalar
// performance and SIMD (vector lanes can't branch independently).
//
// The trick: allocate a grid that's 1 cell bigger on *every* side,
// fill that extra border with 0 (empty), and never let the "logical"
// grid touch the true edges of the buffer. Now x-1, x+1, y-1, y+1
// are ALWAYS valid memory to read — worst case you read a border
// zero, which is exactly the right answer anyway (an empty neighbor
// contributes 0 to the count). Bounds checks disappear entirely.
// -----------------------------------------------------------------

// Converts a *logical* row index y (0 = first real row, can also be
// -1 or f.h for the padding rows above/below) into a byte offset
// into `data` pointing at the start of that row's *logical* cells
// (i.e. already past the left padding column).
@(private)
row_offset :: #force_inline proc(f: Floor, y: int) -> int {
	// (y+1): shift by 1 because row -1 (padding) must map to real row 0
	//        of the buffer, row 0 (first real row) maps to buffer row 1, etc.
	// * f.stride: each buffer row is `stride` bytes wide (w + 2), not w.
	// + 1: skip the single padding byte at the start of the row (the
	//      "x = -1" column) so offset 0 in the returned pointer means
	//      logical x = 0.
	return (y + 1) * f.stride + 1
}

// Turns a logical (x, y) into an absolute index into `data`.
// Just row_offset (which handles y) plus x (handles the column).
// Defined in terms of row_offset so the two can never disagree —
// this was the actual bug you hit earlier: an independently-written
// `index` used the wrong stride and silently pointed at different
// bytes than row_offset did, causing writes and reads to disagree.
index :: #force_inline proc(f: Floor, x, y: int) -> int {
	return row_offset(f, y) + x
}

Directions :: [8]m.Point2 {
	{0, -1}, {0, 1}, {1, -1}, {1, 0},
	{1, 1}, {-1, 0}, {-1, 1}, {-1, -1},
}

build_floor :: proc(input: []string) -> Floor {
	w := len(input[0])
	h := len(input)

	w_padded := ((w + LANES - 1) / LANES) * LANES
	stride := w_padded + 2

	// Buffer size: (h + 2) padded rows, each `stride` bytes wide.
	// make() zero-initializes, so every padding byte starts as 0
	// ("no @ tile here") automatically — we never have to touch
	// the padding ourselves.
	data := make([]u8, stride * (h + 2), context.temp_allocator)

	for line, y in input {
		// Where does logical row y start in the buffer?
		base := row_offset(Floor{data, w, h, w_padded, stride}, y)

		for slot, x in line {
			data[base + x] = slot == '@' ? 1 : 0
		}
	}

	return Floor{data, w, h, w_padded, stride}
}

// -----------------------------------------------------------------
// Loads LANES (32) consecutive bytes starting at pointer p into a
// SIMD register, WITHOUT any bounds checking and without requiring
// p to be aligned to a 32-byte boundary.
//
// "Unaligned" matters because we're going to call this at offsets
// like x-1, x, x+1 — three loads that are each shifted by just 1
// byte from each other. There's no way to make all three aligned
// simultaneously, so we need a load instruction that doesn't care.
// (Unaligned loads are slightly slower than aligned ones on some
// CPUs, but nowhere near slow enough to give up the technique.)
// -----------------------------------------------------------------
@(private)
simd_load :: #force_inline proc(p: [^]u8) -> #simd[LANES]u8 {
	return intrinsics.unaligned_load((^#simd[LANES]u8)(p))
}

get_accessible :: proc(floor: Floor, list: ^[dynamic]m.Point2) -> []m.Point2 {
	for y in 0 ..< floor.h {
		// Get raw, UNCHECKED pointers to the start of three rows:
		// the one we're evaluating, and the ones directly above/below.
		//
		// These MUST be [^]u8 (multi-pointer), not []u8 (slice).
		// A slice carries a length and Odin bounds-checks every
		// index against it — row[x-1] with x==0 would be index -1,
		// which panics. A [^]u8 has no length attached, so indexing
		// it is raw pointer arithmetic: no check, no panic, and it
		// correctly reads into the padding bytes we set up earlier.
		row       := ([^]u8)(&floor.data[row_offset(floor, y)])
		row_above := ([^]u8)(&floor.data[row_offset(floor, y - 1)])
		row_below := ([^]u8)(&floor.data[row_offset(floor, y + 1)])

		x := 0

		// Main SIMD loop: process LANES (32) cells at a time.
		// Stops once there isn't a full chunk of 32 left in this row.
		for ; x + LANES <= floor.w_padded; x += LANES {
			// Load 32 consecutive "is this an @" bytes (0/1) starting
			// at column x of the current row.
			center := simd_load(&row[x])

			// Cheap early-out: if every byte in this chunk is 0,
			// there are no '@' tiles here at all, so none of these
			// 32 cells can possibly end up in the result list.
			// reduce_or ORs all 32 lanes together into one value —
			// nonzero if ANY lane was nonzero.
			// This skips the (relatively expensive) 8-neighbor sum
			// below for large empty stretches of the grid.
			if simd.reduce_or(center) == 0 {
				continue
			}

			// Accumulate the neighbor count for all 32 cells in
			// this chunk simultaneously. Each simd_load below reads
			// a *shifted* window of 32 bytes: e.g. row_above[x-1]
			// gives you, for every one of the 32 cells at columns
			// x..x+31, the north-west neighbor's value, all in one
			// vector op. Do this 8 times (once per direction) and
			// `sum` ends up holding, per-lane, the exact neighbor
			// count for that cell — computed for 32 cells at once
			// instead of one cell at a time in a scalar loop.
			sum: #simd[LANES]u8
			sum += simd_load(&row_above[x - 1]) // NW
			sum += simd_load(&row_above[x])     // N
			sum += simd_load(&row_above[x + 1]) // NE
			sum += simd_load(&row[x - 1])       // W
			sum += simd_load(&row[x + 1])       // E
			sum += simd_load(&row_below[x - 1]) // SW
			sum += simd_load(&row_below[x])     // S
			sum += simd_load(&row_below[x + 1]) // SE

			// Vector compare: for each of the 32 lanes, is sum < 4?
			// Result is a mask vector — each lane is all-1s (true)
			// or all-0s (false), not a normal bool.
			hit := simd.lanes_lt(sum, (#simd[LANES]u8)(4))

			// We only care about cells that are ACTUALLY '@' tiles
			// (an empty cell with <4 neighbors isn't "accessible",
			// it's just empty). AND the two masks together so `hit`
			// is true only where center != 0 AND sum < 4.
			hit = simd.bit_and(hit, simd.lanes_ne(center, (#simd[LANES]u8)(0)))

			// Pull the mask out of the SIMD register into a normal
			// fixed-size array so we can inspect individual lanes
			// with a regular scalar loop. This part (deciding which
			// specific x positions to append) is inherently scalar —
			// appending to a growable list isn't something you can
			// vectorize — but it's cheap since we already filtered
			// down to just the chunks/lanes that matter.
			arr := simd.to_array(hit)
			for i in 0 ..< LANES {
				if arr[i] != 0 {
					append(list, m.Point2{x + i, y})
				}
			}
		}
	}

	return list[:]
}

part1 :: proc(input: []string) -> string {
	floor := build_floor(input);

	list : [dynamic]m.Point2
	defer delete(list)

	get_accessible(floor, &list)

    return fmt.aprintf("%d", len(list), allocator = context.temp_allocator)
}

part2 :: proc(input: []string) -> string {
	floor := build_floor(input);
	sum := 0

	list: [dynamic]m.Point2
	defer delete(list)

	for {
		clear(&list)

		get_accessible(floor, &list)

		if len(list) == 0 {
			break
		}

		sum += len(list)

		for p in list {
			floor.data[index(floor, p.x, p.y)] = 0
		}
	}

    return fmt.aprintf("%d", sum, allocator = context.temp_allocator)
}

main :: proc() {
	result := aoc.run_day(
		2025,
		4,
		part1,
		part2,
	)

	fmt.println(result)
}
