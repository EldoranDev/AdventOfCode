package main

import "core:slice"
import "aoc:array"
import "core:strings"
import "core:fmt"

import aoc "aoc:app"
import a2d "aoc:array2d"

Operation :: enum {
	Multiply,
	Add,
}

parse_input :: proc(input: []string) -> (problems: a2d.Grid(int), operations: []Operation) {
	firstLine := strings.fields(input[0], context.temp_allocator)
	inp := a2d.make_grid(string, len(firstLine), len(input))

	for line, i in input {
		a2d.set_row(&inp, i, strings.fields(line, context.temp_allocator))
	}

	m := a2d.rotate_cw(inp)

	operations = array.map_to(
		a2d.get_column(m, 0),
		proc (l: string) -> Operation {
			if l == "*" {
				return .Multiply
			}

			return .Add
		},
	)

	problems = a2d.make_grid(int, m.width - 1, m.height)

	for line in 0..<m.height {
		a2d.set_row(&problems, line, array.map_to_int(a2d.row(m, line)[1:]))
	}

	return
}

part1 :: proc(input: []string) -> string {
	problems, ops := parse_input(input)

	res := 0
	for i in 0..<problems.height {
		problem := a2d.row(problems, i)

		context.user_index = i
		context.user_ptr = &ops
		res += slice.reduce(
			problem[1:],
			problem[0],
			proc(a, b: int) -> int {
				ops  := cast(^[]Operation)context.user_ptr

				switch ops[context.user_index] {
					case .Multiply:
						return a * b
					case .Add:
						return a + b
				}

				panic("Invalid operation type")
			},
		)
	}

	return fmt.aprintf("%d", res, allocator = context.temp_allocator)
}

part2 :: proc(input: []string) -> string {
    return "not implemented"
}

main :: proc() {
	result := aoc.run_day(
		2025,
		6,
		part1,
		part2,
	)

	fmt.println(result)
}
