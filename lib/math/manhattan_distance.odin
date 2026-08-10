package aoc_math

manhattan_distance :: proc (a, b: [$N]$T) -> T {
	d: T
	#unroll for i in 0..<N do d += abs(a[i] - b[i])
	return d
}
