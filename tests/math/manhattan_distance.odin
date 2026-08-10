package aoc_math_tests

import "core:testing"

import m "aoc:math"

@(test)
manhattan_distance_points:: proc(t: ^testing.T) {
	testing.expect_value(t, m.manhattan_distance(
			m.Point2{2, 3},
			m.Point2{5, 7},
		), 7,
	)

	testing.expect_value(t, m.manhattan_distance(
		m.Point3{-1, 0, 2},
		m.Point3{0, 0, 1},
		),
		2,
	)

	testing.expect_value(t, m.manhattan_distance(
		m.Point4{-1, 0, 2, 1},
		m.Point4{0, 0, 1, -2},
		),
		5,
	)
}
