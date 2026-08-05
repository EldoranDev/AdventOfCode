package main

import "core:strings"
import "core:strconv"
import "core:fmt"
import aoc "../../aoclib"

Range :: [2]i64

parse_ranges :: proc(input: []string) -> []Range {
	rawRanges, _ := strings.split(input[0], ",", allocator = context.temp_allocator)

	ranges := make([]Range, len(rawRanges))

	for r, i in rawRanges {
		rr, _ := strings.split(r, "-", allocator = context.temp_allocator)

		n1, _ := strconv.parse_i64(rr[0])
		n2, _ := strconv.parse_i64(rr[1])

		ranges[i] = { n1, n2 }
	}

	return ranges
}

part1 :: proc(input: []string) -> string {
	ranges := parse_ranges(input)
	defer delete(ranges)

	buf := [128]byte{}
	sum : i64 = 0

	for range in ranges {
		for i := range[0]; i <= range[1]; i += 1 {
			num := strconv.write_int(buf[:], i, 10)

			n1 := num[0:len(num)/2]
			n2 := num[len(num)/2:]

			if strings.compare(n1, n2) == 0 {
				sum += i
			}
		}
	}

	return fmt.aprintf("%d", sum, allocator = context.temp_allocator)
}

part2 :: proc(input: []string) -> string {
	ranges := parse_ranges(input)
	defer delete(ranges)

	buf := [64]byte{}
	code_buf := [128]byte{}

	sum : i64 = 0

	for range in ranges {
		for i := range[0]; i <= range[1]; i += 1 {
			num := strconv.write_int(buf[:], i, 10)
			n := len(num)

			copy(code_buf[:n], num)
			copy(code_buf[n:n*2], num)

			code := string(code_buf[1:n*2-1])

			if strings.contains(code, num) {
				sum += i
			}
		}
	}

	return fmt.aprintf("%d", sum, allocator = context.temp_allocator)
}

main :: proc() {
	result := aoc.run_day(
		2025,
		2,
		part1,
		part2,
	)

	fmt.println(result)
}
