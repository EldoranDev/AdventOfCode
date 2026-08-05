package main

import "core:math"
import "core:strings"
import "core:strconv"
import "core:fmt"
import aoc "../../aoclib"

Range :: [2]i64

parse_ranges :: proc(input: []string) -> []Range {
	ranges := make([dynamic]Range, len(input))
	rawRanges, _ := strings.split(input[0], ",")

	for r, i in rawRanges {
		rr, _ := strings.split(r, "-")

		n1, _ := strconv.parse_i64(rr[0])
		n2, _ := strconv.parse_i64(rr[1])

		append(&ranges, [2]i64{
			n1,
			n2
		})
	}

	return ranges[:]
}

part1 :: proc(input: []string) -> string {
	ranges := parse_ranges(input)
	defer delete(ranges)

	buf := [128]u8{}
	sum : i64 = 0

	for range in ranges {
		for i := range[0]; i <= range[1]; i += 1 {
			num := strconv.write_int(buf[:], i, 10)

			n1 := num[0:i64(math.floor(f64(len(num))/2))]
			n2 := num[i64(math.floor(f64(len(num))/2)):]

			if strings.compare(n1, n2) == 0 {
				sum += i
			}
		}
	}

	return fmt.aprintf("%d", sum)
}

part2 :: proc(input: []string) -> string {
	ranges := parse_ranges(input)
	defer delete(ranges)

	buf := [128]byte{}
	sum : i64 = 0

	for range in ranges {
		for i := range[0]; i <= range[1]; i += 1 {
			num := strconv.write_int(buf[:], i, 10)

			code := fmt.aprintf("%s%s", num, num)
			code = code[1:(len(num)*2)-1]

			if strings.contains(code, num) {
				sum += i
			}
		}
	}

	return fmt.aprintf("%d", sum)
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
