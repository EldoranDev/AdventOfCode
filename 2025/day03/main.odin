package main

import "core:strings"
import "core:strconv"
import "core:fmt"
import aoc "../../aoclib"

findHighest :: proc(inp: []int, num_batteries: int, acc := 0, taken := 0) -> int {
	if taken == num_batteries {
		return acc
	}

	highest := [2]int{}

	for i := 0; i <= len(inp) - (num_batteries - taken); i += 1 {
		if highest[0] < inp[i] {
			highest[0] = inp[i]
			highest[1] = i
		}
	}

	return findHighest(inp[highest[1]+1:], num_batteries, acc * 10 +  highest[0], taken + 1)
}

parse_input :: proc(input: []string) -> [][]int {
	banks := make([][]int, len(input), context.temp_allocator)

	for line, i in input {
		bank := make([]int, len(input[i]), context.temp_allocator)

		for c, j in line {
			bank[j] = int(c - '0')
		}

		banks[i] = bank
	}

	return banks
}

part1 :: proc(input: []string) -> string {
	banks := parse_input(input)
	defer {
		for bank in banks do delete(bank)
		delete(banks)
	}

	sum := 0

	for bank in banks {
		sum += findHighest(bank, 2)
	}

	return fmt.aprintf("%d", sum, allocator = context.temp_allocator)
}

part2 :: proc(input: []string) -> string {
	banks := parse_input(input)

	sum := 0

	for bank in banks {
		sum += findHighest(bank, 12)
	}

	return fmt.aprintf("%d", sum, allocator = context.temp_allocator)
}

main :: proc() {
	result := aoc.run_day(
		2025,
		3,
		part1,
		part2,
	)

	fmt.println(result)
}
