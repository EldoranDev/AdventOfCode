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
	postfix := test ? "in-test" : "in"
	path := fmt.aprintf(
		"inputs/%d/%02d.%s",
		year,
		day,
		postfix,
		allocator = allocator,
	)
	defer delete(path, allocator)

	data, err := os.read_entire_file(path, allocator)

	if err != nil {
		fmt.eprintf("%v", err)
		return nil, false
	}
	defer delete(data, allocator)

	lines: [dynamic]string

	it := string(data)
	for line in strings.split_lines_iterator(&it) {
		append(&lines, strings.clone(line, allocator))
	}

	if lines[len(lines) - 1] == "" {
		pop_dynamic_array(&lines)
	}

	return lines[:], true
}

get_input_groups :: proc (
	input: []string,
	allocator := context.allocator,
) -> [][]string {
	groups := make([dynamic][]string, allocator = allocator)
	group := make([dynamic]string, allocator = allocator)

	for line in input {
		if len(line) == 0 {
			append(&groups, group[:])

			group = make([dynamic]string, allocator = allocator)
			continue
		}

		append(&group, line)
	}

	append(&groups, group[:])

	return groups[:]
}
