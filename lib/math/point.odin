package aoc_math

Point2 :: [2]int
Point3 :: [3]int
Point4 :: [4]int

clone_point :: proc(p: $T/[$U]int) -> T {
	c := new(T)

	for i in 0..<U {
		c[i] = p[i]
	}

	return c^
}
