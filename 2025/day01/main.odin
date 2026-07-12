package main

import "core:fmt"
import "core:os"
import "core:strconv"
import aoc "../../aoclib"

part1 :: proc(input: string) -> string {
    return "not implemented"
}

part2 :: proc(input: string) -> string {
    return "not implemented"
}

main :: proc() {
    part := len(os.args) > 1 ? (strconv.parse_int(os.args[1]) or_else 1) : 1
    test := len(os.args) > 2 && os.args[2] == "--test"

    input, ok := aoc.read_input(2025, part, test)
    if !ok {
        fmt.eprintln("could not read input")
        os.exit(1)
    }

    result := part == 1 ? part1(input) : part2(input)
    fmt.println(result)
}
