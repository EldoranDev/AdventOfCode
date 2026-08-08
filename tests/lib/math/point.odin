package aoclib_math_tests

import "core:testing"

import m "aoc:math"

@(test)
manhattan_distance_test_point2:: proc(t: ^testing.T) {
	testing.expect_value(
		t,
		m.manhattan_distance_point2(
			m.Point2{2, 3},
			m.Point2{5, 7},
		),
		7,
	)
}

@(test)
manhattan_distance_test_point3:: proc(t: ^testing.T) {
	testing.expect_value(
		t,
		m.manhattan_distance_point3(
			m.Point3{-1, 0, 2},
			m.Point3{0, 0, 1},
		),
		2,
	)
}

@(test)
manhattan_distance_test_point4:: proc(t: ^testing.T) {
	testing.expect_value(
		t,
		m.manhattan_distance_point4(
			m.Point4{-1, 0, 2, 1},
			m.Point4{0, 0, 1, -2},
		),
		5,
	)
}
