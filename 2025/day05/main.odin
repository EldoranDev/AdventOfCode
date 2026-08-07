package main

import "core:slice"
import "core:strconv"
import "core:strings"
import "core:fmt"
import aoc "../../aoclib"

Range :: struct {
	from: int,
	to: int,
}

parse_range :: proc (line: string) -> Range {
	parts := strings.split(line, "-", allocator = context.temp_allocator)

	from, fromOk := strconv.parse_int(parts[0]); assert(fromOk)
	to, toOk := strconv.parse_int(parts[1]); assert(toOk)

	return { from, to }
}

parse_input :: proc (input: []string) -> ([]Range, []int) {
	groups := aoc.get_input_groups(input)

	ranges := aoc.map_to(groups[0], parse_range)
	ids := aoc.map_to_int(groups[1])

	return ranges, ids
}

part1 :: proc(input: []string) -> string {
	ranges, ids := parse_input(input)

	count := 0

	for id in ids {
		for range in ranges {
			if range.from <= id && range.to >= id {
				count += 1
				break
			}
		}
	}

    return fmt.aprintf("%d", count, allocator = context.temp_allocator)
}

part2 :: proc(input: []string) -> string {
	ranges, _ := parse_input(input)

	slice.sort_by_cmp(ranges, proc (a, b: Range) -> slice.Ordering {
		if a.from == b.from do return .Equal
		if a.from > b.from do return .Greater

		return .Less
	})

	count := 0

	rngs := slice.to_dynamic(ranges, context.temp_allocator)

	for i := 0; i < len(rngs); i += 1 {
		for {
			if !(i + 1 < len(rngs) && rngs[i].to >= rngs[i+1].from) {
				break
			}

			rngs[i].to = max(rngs[i+1].to, rngs[i].to)
			ordered_remove(&rngs, i+1)
		}

		count += rngs[i].to - rngs[i].from + 1
	}

	return fmt.aprintf("%d", count, allocator = context.temp_allocator)
}

main :: proc() {
	result := aoc.run_day(
		2025,
		5,
		part1,
		part2,
	)

	fmt.println(result)
}
