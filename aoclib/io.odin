package aoclib

import "core:os"
import "core:strings"
import "core:fmt"

read_input :: proc(
	year: int,
	day: int,
	test: bool,
	allocator := context.allocator,
) -> ([]string, bool) {
	data, err := os.read_entire_file(
		fmt.aprintf(
			"inputs/%d/%02d/input.txt",
			year,
			day,
		),
		allocator
	)

	if err != nil {
		fmt.eprintf("%v", err)
		return nil, false
	}
	defer delete(data, allocator)

	lines: [dynamic]string

	it := string(data)
	for line in strings.split_lines_iterator(&it) {
		append(&lines, line)
	}

	return lines[:], true
}

get_input_groups :: proc (
	input: []string,
) -> ([][]string, bool) {
	return {}, false
}
