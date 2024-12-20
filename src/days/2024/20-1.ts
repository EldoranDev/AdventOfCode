import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { Grid2D } from "@lib/array2d";

interface Node {
    pos: Vec2;
    distance: number;
    prev: Node;
}

export default function (input: string[], { logger }: Context) {
    const nodes = new Map<string, Node>();
    const shortcuts = new Map<string, number>();

    const grid = input.map((line) => line.split(""));

    const start = findPoint("S", grid);
    const finish = findPoint("E", grid);

    const goal = getPath(start, finish, grid);

    let curr = goal;
    let distance = 0;

    while (curr !== null) {
        nodes.set(curr.pos.toString(), curr);

        curr.distance = distance;
        curr = curr.prev;

        distance++;
    }

    for (const node of nodes.values()) {
        for (const dir of Vec2.ULRD) {
            const wall = Vec2.add(node.pos, dir);
            const np = Vec2.add(wall, dir);

            if (grid[wall.y][wall.x] !== "#") {
                continue;
            }

            if (!nodes.has(np.toString())) {
                continue;
            }

            const nn = nodes.get(np.toString());

            if (nn.distance < node.distance) {
                const diff = node.distance - nn.distance;
                shortcuts.set(`${wall}-${np}`, diff - 2);
            }
        }
    }

    return [...shortcuts.values().filter((v) => v >= 100)].length;
}

function findPoint(poi: string, grid: Grid2D<string>): Vec2 {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === poi) {
                return new Vec2(x, y);
            }
        }
    }

    throw new Error("Point coult not be found");
}

function getPath(from: Vec2, to: Vec2, grid: Grid2D<string>): Node {
    const closed = new Set<string>();

    let next: Node | null = {
        distance: 0,
        pos: from,
        prev: null,
    };

    while (next !== null) {
        closed.add(next.pos.toString());
        const curr = next;
        next = null;

        if (curr.pos.equals(to)) {
            return curr;
        }

        for (const dir of Vec2.ULRD) {
            const np = Vec2.add(curr.pos, dir);

            if (grid[np.y][np.x] === "#") {
                continue;
            }

            if (closed.has(np.toString())) {
                continue;
            }

            next = {
                distance: 0,
                pos: np,
                prev: curr,
            };
        }
    }

    throw new Error("No path found");
}
