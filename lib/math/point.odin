package aoc_math

import "core:math"

Point2 :: [2]int
Point3 :: [3]int
Point4 :: [4]int

manhattan_distance_point :: proc{manhattan_distance_point2, manhattan_distance_point3, manhattan_distance_point4}

manhattan_distance_point2 :: proc (a: Point2, b: Point2) -> int {
	return math.abs(a.x - b.x) + math.abs(a.y - b.y)
}

manhattan_distance_point3 :: proc (a: Point3, b: Point3) -> int {
	return math.abs(a.x - b.x) + math.abs(a.y - b.y) + math.abs(a.z - b.z)
}

manhattan_distance_point4 :: proc (a: Point4, b: Point4) -> int {
	return math.abs(a.x - b.x) + math.abs(a.y - b.y) + math.abs(a.z - b.z) + math.abs(a.w - b.w)
}
