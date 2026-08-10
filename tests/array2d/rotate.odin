package aoc_array2d_tests

import "core:testing"

import a2d "aoc:array2d"

@(test)
rotation_counter_clockwise :: proc(t: ^testing.T) {
	g := a2d.make_grid_from([][]int{
		{0, 0},
		{1, 0},
	})

	rg := a2d.rotate_ccw(g)

	testing.expect(
		t,
		a2d.equals(
			rg,
			a2d.make_grid_from([][]int{
				{0, 0},
				{0, 1},
			}),
		),
	)
}

@(test)
rotation_clockwise :: proc(t: ^testing.T) {
	g := a2d.make_grid_from([][]int{
		{0, 0},
		{1, 0},
	})

	rg := a2d.rotate_cw(g)

	testing.expect(
		t,
		a2d.equals(
			rg,
			a2d.make_grid_from([][]int{
				{1, 0},
				{0, 0},
			}),
		),
	)
}
