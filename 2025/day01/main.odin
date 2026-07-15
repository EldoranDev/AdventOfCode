package main

import "core:fmt"
import "core:os"
import "core:strconv"
import aoc "../../aoclib"

LockSize :: 100

Rotation :: struct {
	dir: byte,
	amount: int
}

Rotations :: [dynamic]Rotation

parse_rotations :: proc (input: []string) -> Rotations {
	rots := make(Rotations, len(input))
	for line in input {
		num, ok := strconv.parse_int(line[1:])
		assert(ok, "can't parse line")
		append(&rots, Rotation{line[0], num})
	}

	return rots
}

part1 :: proc(input: []string) -> string {
	rots := parse_rotations(input)
	defer delete(rots)

	dial := 50
	count := 0

	for rot in rots {
		switch rot.dir {
		case 'L':
			dial -= rot.amount
		case 'R':
			dial += rot.amount
		}

		dial %= LockSize

		for dial < 0 {
			dial += LockSize
			dial %= LockSize
		}

		if dial == 0 {
			count += 1
		}
	}

	return fmt.aprintf("%d", count)
}

part2 :: proc(input: []string) -> string {
	rots := parse_rotations(input)
	defer delete(rots)

	dial := 50
	count := 0

	for rot in rots {
		for i in 0..<rot.amount {
			if rot.dir == 'R' {
				dial += 1
			} else {
				dial -= 1
			}
			dial %= LockSize

			if dial < 0 {
				dial += LockSize
				dial %= LockSize
			}

			if dial == 0 {
				count += 1
			}
		}
	}

	return fmt.aprintf("%d", count)
}

main :: proc() {
    part := len(os.args) > 1 ? (strconv.parse_int(os.args[1]) or_else 1) : 1
    test := len(os.args) > 2 && os.args[2] == "--test"

    input, ok := aoc.read_input(2025, 1, test)
    if !ok {
        fmt.eprintln("could not read input")
        os.exit(1)
    }
    defer {
    	for line in input do delete(line)
    	delete(input)
    }

    result := part == 1 ? part1(input) : part2(input)
    fmt.println(result)
}
