package main

import "core:strings"
import "core:fmt"
import aoc "aoc:app"
import a2d "aoc:array2d"
import am "aoc:math"

part1 :: proc(input: []string) -> string {
	grid := a2d.input_to_grid(input)
	start := strings.index(input[0], "S")

	queue: [dynamic]am.Point2

	append(&queue, am.Point2{ start, 0})

	a2d.set(&grid, start, 0, ".")

	count := 0

	for {
		if len(queue) == 0 {
			break
		}

		beam := pop(&queue)
		cont := true

		for cont {
			if !a2d.is_save(grid, beam.x, beam.y) {
				break
			}

			switch a2d.get(grid, beam.x, beam.y) {
				case ".":
					a2d.set(&grid, beam.x, beam.y, "|")
					beam += am.Point2{0, 1}
				case "|":
					cont = false
				case "^":
					append(&queue, am.Point2{ beam.x - 1, beam.y}, am.Point2{ beam.x + 1, beam.y})
					count += 1

					cont = false
			}
		}

	}

	return fmt.aprintf("%d", count, allocator = context.temp_allocator)
}

p2_grid : a2d.Grid(string)
p2_cache : map[am.Point2]int

part2 :: proc(input: []string) -> string {
	p2_grid = a2d.input_to_grid(input)
	p2_cache = make(map[am.Point2]int, context.temp_allocator)

	start := am.Point2{
		strings.index(input[0], "S"),
		0,
	}

	a2d.set(&p2_grid, start.x, start.y, ".")

	res := count(start)

    return fmt.aprintf("%d", res, allocator = context.temp_allocator)
}

count :: proc (start: am.Point2) -> int {
	cnt, ok := p2_cache[start]
	if ok {
		return cnt
	}

	pos := start

	for {
		if !a2d.is_save(p2_grid, pos.x, pos.y){
			p2_cache[start] = 1
			return 1
		}

		if a2d.get(p2_grid, pos.x, pos.y) == "." {
			pos += am.Point2{0, 1}
			continue
		}

		if a2d.get(p2_grid, pos.x, pos.y) == "^" {
			cnt = count(pos + am.Point2{-1, 0}) + count(pos + am.Point2{1, 0})
			p2_cache[start] = cnt
			return cnt
		}
	}
}

main :: proc() {
	result := aoc.run_day(
		2025,
		7,
		part1,
		part2,
	)

	fmt.println(result)
}
