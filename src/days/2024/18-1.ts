import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { create, Grid2D, print } from "@lib/array2d";
import { MinHeap } from "@lib/collections";

interface Node {
    pos: Vec2;
    cost: number;
    prev: Node;
}

export default function (input: string[], { logger, test }: Context) {
    const size = test ? new Vec2(7, 7) : new Vec2(71, 71);
    const byteCount = test ? 12 : 1024;
    const bytes = input.map((line) => {
        const [x, y] = line.split(",");

        return new Vec2(Number(x), Number(y));
    });

    const grid = create(size.x, size.y, ".");

    for (let i = 0; i < byteCount; i++) {
        grid[bytes[i].y][bytes[i].x] = "#";
    }

    const [last] = findPath(new Vec2(0, 0), new Vec2(size.x - 1, size.y - 1), grid);

    return last.cost;
}

function findPath(from: Vec2, to: Vec2, grid: Grid2D<string>): Node[] {
    const openSet = new MinHeap<Node>();
    const closedSet = new Set<string>();

    const nodes = new Map<string, Node>();

    const sn = getNode(from, nodes, grid);

    sn.cost = 0;

    openSet.push(sn, 0);

    while (openSet.length > 0) {
        const cur = openSet.shift();

        if (closedSet.has(cur.pos.toString())) {
            continue;
        }

        if (cur.pos.equals(to)) {
            // TODO: show actuall path
            return [cur];
        }

        closedSet.add(cur.pos.toString());

        for (const dir of Vec2.ULRD) {
            const n = Vec2.add(cur.pos, dir);

            const next = getNode(n, nodes, grid);

            if (next === null || grid[next.pos.y][next.pos.x] === "#") {
                continue;
            }

            if (cur.cost + 1 >= next.cost) {
                continue;
            }

            next.cost = cur.cost + 1;
            next.prev = cur;

            openSet.push(next, next.cost + next.pos.manhattan(to));
        }
    }
}

function getNode(pos: Vec2, nodes: Map<string, Node>, grid: Grid2D<string>): Node | null {
    if (pos.y < 0 || pos.y === grid.length || pos.x < 0 || pos.x >= grid[pos.y].length) {
        return null;
    }

    if (!nodes.has(pos.toString())) {
        nodes.set(pos.toString(), {
            pos: pos.clone(),
            cost: Number.MAX_SAFE_INTEGER,
            prev: null,
        });
    }

    return nodes.get(pos.toString());
}
