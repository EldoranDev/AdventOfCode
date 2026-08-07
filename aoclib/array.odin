package aoclib

import "core:fmt"
import "core:strconv"

map_to :: proc (input: []string, f: proc(string) -> $T) -> []T {
	res := make([]T, len(input))

	for v, i in input {
		res[i] = f(v)
	}

	return res
}

map_to_int :: proc (input: []string, allocator := context.allocator) -> []int {
	res := make([]int, len(input), allocator)

	for line, i in input {
		id, ok := strconv.parse_int(line); assert(ok)

		res[i] = id
	}

	return res
}
