package aoc_array2d_tests

import "core:testing"

import a2d "aoc:array2d"

@(test)
flip_horizontal :: proc(t: ^testing.T) {
	g := a2d.make_grid_from([][]int{
		{1, 0},
		{1, 0},
	})

	rg := a2d.flip_horizontal(g)

	testing.expect(
		t,
		a2d.equals(
			rg,
			a2d.make_grid_from([][]int{
				{0, 1},
				{0, 1},
			}),
		),
	)
}
