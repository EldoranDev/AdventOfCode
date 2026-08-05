package aoclib

import "core:strings"
import "core:fmt"
import "core:os"
import "core:strconv"

run_day :: proc (
	year: int,
	day: int,
	part1: proc([]string) -> string,
	part2: proc([]string) -> string,
) -> string {
	defer free_all(context.temp_allocator)

	part := len(os.args) > 1 ? (strconv.parse_int(os.args[1]) or_else 1) : 1
    test := len(os.args) > 2 && os.args[2] == "--test"

    input, ok := read_input(year, day, test)
    if !ok {
        fmt.eprintln("could not read input")
        os.exit(1)
    }

    defer {
    	for line in input do delete(line)
    	delete(input)
    }

    result := part == 1 ? part1(input) : part2(input)

    return strings.clone(result)
}
