import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { MinHeap } from "@lib/collections";

class Node {
    constructor(
        public pos: Vec2,
        public dir: Vec2,
        public cost: number,
        public prev: Node[],
    ) {}

    public toString(): string {
        return `${this.pos}-${this.dir}`;
    }
}

export default function (input: string[], { logger }: Context) {
    const map = input.map((line) => line.split(""));

    const start = getPoint(map, "S");
    const end = getPoint(map, "E");

    const open = findPath(start, end, map);

    const seats = new Set<string>();

    while (open.length > 0) {
        const curr = open.shift();

        seats.add(curr.pos.toString());

        if (curr.prev !== null) {
            open.push(...curr.prev);
        }
    }

    return seats.size;
}

function findPath(from: Vec2, to: Vec2, map: string[][]): Node[] {
    const sn: Node = new Node(from, new Vec2(1, 0), 0, null);

    const nodes = new Map<string, Node>();

    const open = new MinHeap<Node>();
    const closed = new Set<string>();

    nodes.set(sn.toString(), sn);
    open.push(sn, 0);

    const endNodes = new Map<string, Node>();

    while (open.length > 0) {
        const curr = open.shift();

        if (closed.has(curr.toString())) {
            continue;
        }

        if (curr.pos.equals(to)) {
            endNodes.set(curr.toString(), curr);
            continue;
        }

        closed.add(curr.toString());

        for (const [node, cost] of getNext(curr, nodes)) {
            // Do not re-check closed nodes
            if (closed.has(node.toString())) {
                continue;
            }

            // We can't move throuhg walls
            if (map[node.pos.y][node.pos.x] === "#") {
                continue;
            }

            // Quicker path exists
            if (curr.cost + cost > node.cost) {
                continue;
            }

            // current path takes the same amount of time to reach the node
            if (curr.cost + cost === node.cost) {
                node.prev.push(curr);
                open.push(node, node.cost + node.pos.manhattan(to));
            } else {
                // Quicker way found
                node.prev = [curr];
                node.cost = curr.cost + cost;

                open.push(node, node.cost + 1);
            }
        }
    }

    if (endNodes.size === 0) {
        throw new Error("Could not find path");
    }

    return [...endNodes.values()];
}

function getPoint(map: string[][], point: string): Vec2 {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === point) {
                return new Vec2(x, y);
            }
        }
    }

    throw new Error("Could not find start point");
}

function* getNext(node: Node, nodes: Map<string, Node>): Generator<[Node, number]> {
    // Get Rotations
    const l = Vec2.rotate(node.dir, -90, "deg");
    const r = Vec2.rotate(node.dir, 90, "deg");

    yield [getNode(node.pos, l, nodes), 1000];
    yield [getNode(node.pos, r, nodes), 1000];

    // Get Node in front
    yield [getNode(Vec2.add(node.pos, node.dir), node.dir, nodes), 1];
}

function getNode(pos: Vec2, dir: Vec2, nodes: Map<string, Node>): Node {
    if (!nodes.has(`${pos}-${dir}`)) {
        nodes.set(`${pos}-${dir}`, new Node(pos, dir, Number.MAX_SAFE_INTEGER, []));
    }

    return nodes.get(`${pos}-${dir}`);
}
