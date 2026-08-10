package aoc_array2d

import "core:slice"
import "core:fmt"
import "core:strings"
import "core:mem"
import "base:intrinsics"

Grid :: struct($T: typeid) {
	data: []T,
	width, height: int,
	allocator: mem.Allocator,
}

make_grid :: proc($T: typeid, width, height: int, allocator := context.temp_allocator) -> Grid(T) {
	return Grid(T) {
		data = make([]T, width * height, allocator),
		width = width,
		height = height,
		allocator = allocator,
	}
}

make_grid_from :: proc(a: [][]$T, allocator := context.temp_allocator) -> Grid(T) {
	width := len(a)
	height := len(a[0])

	grid := Grid(T) {
		data = make([]T, width * height, allocator),
		width = width,
		height = height,
		allocator = allocator,
	}

	for y in 0..<height {
		set_row(&grid, y, a[y])
	}

	return grid
}

input_to_grid :: proc(input: []string, allocator := context.temp_allocator) -> Grid(string) {
	assert(len(input) > 0, "Empty input given")

	height := len(input)
	width := len(input[0])

	data := make([]string, width * height, allocator)
	grid := Grid(string) {
		height = height,
		width = width,
		data = data,
		allocator = allocator,
	}

	for row, y in input {
		set_row(&grid, y, strings.split(row, "", allocator = allocator))
	}

	return grid
}

is_save :: #force_inline proc(g: Grid($T), x, y: int) -> bool {
	return x >= 0 && y >= 0 && x < g.width && y < g.height
}

destroy :: proc(g: ^Grid($T)) {
	delete(g.data)
	g.data, g.width, g.height = nil, 0, 0
}

@(private)
idx :: #force_inline proc (g: Grid($T), x, y: int, loc := #caller_location) -> int {
	assert(0 <= x && x < g.width, "x out of range", loc)
	assert(0 <= y && y < g.height, "y out of range", loc)

	return y * g.width + x
}

get :: #force_inline proc (g: Grid($T), x, y: int, loc := #caller_location) -> T {
	return g.data[idx(g, x, y, loc)]
}

set :: #force_inline proc (g: ^Grid($T), x, y: int, val: T, loc := #caller_location) {
	g.data[idx(g^, x, y, loc)] = val
}

set_row :: proc(g: ^Grid($T), y: int, val: []T, loc := #caller_location) {
	assert(g.width == len(val), "Data passed isn't same len as grid", loc)

	copy(g.data[idx(g^, 0, y):][:len(val)], val)
}

row :: #force_inline proc(g: Grid($T), y: int) -> []T {
	return g.data[y * g.width:y*g.width+g.width]
}

rotate_cw :: proc(a: Grid($T), allocator := context.temp_allocator) -> Grid(T) {
	b := make_grid(T, a.height, a.width, allocator)

	for y in 0..<a.height {
		for x in 0..<a.width {
			b.data[idx(b, a.height - 1 - y, x)] = get(a, x, y)
		}
	}

	return b
}

rotate_ccw :: proc(a: Grid($T), allocator := context.temp_allocator) -> Grid(T) {
	b := rotate_cw(a, allocator)

	slice.reverse(b.data)

	return b
}

flip_horizontal :: proc(a: Grid($T), allocator := context.temp_allocator) -> Grid(T) {
	g := make_grid(T, a.width, a.height, allocator)

	for y in 0..<a.height {
		src, dst := row(a, y), row(g, y)
		for x in 0..<a.width {
			dst[a.width - 1 - x] = src[x]
		}
	}

	return g
}

clone_column :: proc(a: Grid($T), column: int, allocator := context.temp_allocator) -> []T{
	col := make([]T, a.height)

	for row in 0..<a.height {
		col[row] = get(a, column, row)
	}

	return col
}

equals :: proc(a: Grid($T), b: Grid(T)) -> bool {
	assert(intrinsics.type_is_comparable(T), "Can't use equals on arrays with uncomparable types")

	if a.height != b.height || a.width != b.width {
		return false
	}

	for el, i in a.data {
		if el != b.data[i] {
			return false
		}
	}

	return true
}

print :: proc (g: Grid($T), allocator := context.temp_allocator) {
	sb := strings.builder_make(allocator)
	defer strings.builder_destroy(&sb)

	for y in 0..<g.height {
		for x in 0..<g.width {
			fmt.sbprint(&sb, get(g, x, y))
		}

		strings.write_byte(&sb, '\n')
	}

	fmt.print(strings.to_string(sb))
}
