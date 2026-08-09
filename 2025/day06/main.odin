package main

import "core:strconv"
import "core:slice"
import "aoc:array"
import "core:strings"
import "core:fmt"

import aoc "aoc:app"
import a2d "aoc:array2d"
import aio "aoc:io"

Operation :: enum {
	Multiply,
	Add,
}

part1 :: proc(input: []string) -> string {
	problems : a2d.Grid(int)
	operations : []Operation

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

	res := 0
	for i in 0..<problems.height {
		problem := a2d.row(problems, i)

		context.user_index = i
		context.user_ptr = &operations
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
	inp := a2d.make_grid(string, len(input[0]), len(input))

	for line, i in input {
		a2d.set_row(&inp, i, strings.split(strings.left_justify(line, inp.width, " ", allocator = context.temp_allocator), ""))
	}

	m := a2d.rotate_cw(inp)
	m = a2d.flip_horizontal(m)

	lines := make([dynamic]string, context.temp_allocator)

	for y in 0..<m.height {
		line := strings.join(a2d.row(m, y), "", context.temp_allocator)
		append(&lines, strings.trim_space(line))
	}

	sum := 0

	for group in aio.get_input_groups(lines[:], context.temp_allocator) {
		nums := make([dynamic]int, context.temp_allocator)
		op : Operation
		offset : int

		for num, i in group {
			offset = 0

			if i == len(group) - 1 {
				offset = 1
				op = num[len(num) - 1:] == "*" ? .Multiply : .Add
			}

			n := strings.trim_space(num[:len(num) - offset])
			num, ok := strconv.parse_int(n, 10); assert(ok, "could not parse number")

			append(&nums, num)
		}

		acc := nums[0]

		for i in 1..<len(nums) {
			if op == .Multiply {
				acc *= nums[i]
			} else {
				acc += nums[i]
			}
		}

		sum += acc
	}

	return fmt.aprintf("%d", sum)
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
