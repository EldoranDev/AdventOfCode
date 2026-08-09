package aoc_array2d

import "core:slice"
import "core:fmt"
import "core:strings"
import "core:mem"
import "base:intrinsics"

Grid :: struct($T: typeid) {
	data: []T,
	width, height: int,
	allocator: mem.Allocator,
}

make_grid :: proc($T: typeid, width, height: int, allocator := context.temp_allocator) -> Grid(T) {
	return Grid(T) {
		data = make([]T, width * height, allocator),
		width = width,
		height = height,
		allocator = allocator,
	}
}

destroy :: proc(g: ^Grid) {
	delete(g.data)
	g.data, g.width, g.height = nil, 0, 0
}

@(private)
idx :: #force_inline proc (g: Grid($T), x, y: int) -> int {
	return y * g.width + x
}

get :: #force_inline proc (g: Grid($T), x, y: int) -> T {
	return g.data[idx(g, x, y)]
}

set :: #force_inline proc (g: ^Grid($T), x, y: int, val: T) {
	g.data[idx(g^, x, y)] = val
}

set_row :: proc(g: ^Grid($T), y: int, val: []T, loc := #caller_location) {
	assert(g.width == len(val), "Data passed isn't same len as grid", loc)

	start := idx(g^, 0, y)

	for v, i in val {
		g.data[start + i] = v
	}
}

row :: #force_inline proc(g: Grid($T), y: int) -> []T {
	return g.data[y * g.width:y*g.width+g.width]
}

rotate_cw :: proc(a: Grid($T), allocator := context.temp_allocator) -> Grid(T) {
	b := make_grid(T, a.height, a.width, a.allocator)

	for y in 0..<a.height {
		for x in 0..<a.width {
			b.data[idx(b, a.height - 1 -y, x)] = get(a, x, y)
		}
	}

	return b
}

flip_horizontal :: proc(a: Grid($T), allocator := context.temp_allocator) -> Grid(T) {
	g := Grid(T){
		height = a.height,
		width = a.width,
		allocator = allocator,

		data = slice.clone(a.data)
	}

	slice.reverse(g.data)

	return g
}

get_column :: proc(a: Grid($T), collumn: int, allocator := context.temp_allocator) -> []T{
	col := make([]T, a.height)

	for row in 0..<a.height {
		col[row] = get(a, collumn, row)
	}

	return col
}

equals :: proc(a: Grid($T), b: Grid(T)) -> bool {
	assert(intrinsics.type_is_comparable(T), "Can't use equals on arrays with uncomparable types")

	for el, i in a.data {
		if el != b.data[i] {
			return false
		}
	}

	return true
}

print :: proc (g: Grid($T), allocator := context.temp_allocator) {
	sb := strings.builder_make(context.allocator)
	defer strings.builder_destroy(&sb)

	for y in 0..<g.height {
		for x in 0..<g.width {
			fmt.sbprint(&sb, get(g, x, y))
		}

		strings.write_byte(&sb, '\n')
	}

	fmt.print(strings.to_string(sb))
}
