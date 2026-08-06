package main

import "core:fmt"
import aoc "../../aoclib"

import aocmath "../../aoclib/math"

Floor :: struct {
	data: []bool,
	w, h: int,
	dw, dh: int,
}

index :: #force_inline proc(f: Floor, x, y: int) -> int {
	return (y+1) * f.w + (x+1)
}

at :: #force_inline proc(f: Floor, x, y: int) -> bool {
	return f.data[index(f, x, y)]
}

Directions :: [8]aocmath.Point2 {
	{0, -1},
	{0, 1},
	{1, -1},
	{1, 0},
	{1, 1},
	{-1, 0},
	{-1, 1},
	{-1, -1},
}

build_floor :: proc (input: []string) -> Floor {
	dw := len(input[0])
	dh := len(input)
	w := dw + 2
	h := dh + 2

	data := make([]bool, w * h, context.temp_allocator)

	for line, y in input {
		for slot, x in line {
			data[(x+1) + (y+1)*h] = slot == '@'
		}
	}

	return Floor{data, w, h, dw, dh}
}

get_accessible :: proc(floor: Floor, list: ^[dynamic]aocmath.Point2) -> []aocmath.Point2 {
	pos := aocmath.Point2{}

	slot: bool
	count := 0

	for y in 0..<floor.dh {
		for x in 0..<floor.dw {
			pos := aocmath.Point2{x, y}

			slot := at(floor, x, y)

			if !slot {
				continue
			}

			count = 0

			for dir in Directions {
				p := dir + pos
				count += int(at(floor, p.x, p.y))
			}

			if count < 4 {
				append(list, aocmath.Point2{pos.x, pos.y})
			}
		}
	}

	return list[:]
}

part1 :: proc(input: []string) -> string {
	floor := build_floor(input);

	list : [dynamic]aocmath.Point2
	defer delete(list)

	get_accessible(floor, &list)

    return fmt.aprintf("%d", len(list), allocator = context.temp_allocator)
}

part2 :: proc(input: []string) -> string {
	floor := build_floor(input);
	sum := 0

	list: [dynamic]aocmath.Point2
	defer delete(list)

	for {
		clear(&list)

		get_accessible(floor, &list)

		if len(list) == 0 {
			break
		}

		sum += len(list)

		for p in list {
			floor.data[index(floor, p.x, p.y)] = false
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
