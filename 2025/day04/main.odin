package main

import "core:fmt"
import aoc "../../aoclib"

import aocmath "../../aoclib/math"

Floor :: [][]bool

Directions :: []aocmath.Point2 {
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
	floor := make([][]bool, len(input), context.temp_allocator)

	for line, y in input {
		row := make([]bool, len(line), context.temp_allocator)

		for slot, c in line {
			row[c] = slot == '@'
		}

		floor[y] = row
	}

	return floor
}

get_accessible :: proc(floor: Floor) -> []aocmath.Point2 {
	list: [dynamic]aocmath.Point2

	sum := 0

	pos := aocmath.Point2{}

	for row, y in floor {
		pos.y = y
		for col, x in row {
			pos.x = x

			if !col {
				continue
			}

			count := 0

			for dir in Directions {
				p := dir + pos

				if p.x < 0 || p.x >= len(row) || p.y < 0 || p.y >= len(floor) {
					continue
				}

				count += floor[p.y][p.x] ? 1 : 0
			}

			if count < 4 {
				append(&list, aocmath.Point2{pos.x, pos.y})
			}
		}
	}

	return list[:]
}

part1 :: proc(input: []string) -> string {
	floor := build_floor(input);

	list := get_accessible(floor)
	defer delete(list)

    return fmt.aprintf("%d", len(list), allocator = context.temp_allocator)
}

part2 :: proc(input: []string) -> string {
	floor := build_floor(input);

	found := true

	sum := 0

	for {
		list := get_accessible(floor)
		defer delete(list)

		if len(list) == 0 {
			break
		}

		sum += len(list)

		for p in list {
			floor[p.y][p.x] = false
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
