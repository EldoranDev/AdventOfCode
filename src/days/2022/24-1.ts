/* eslint-disable max-len */
import {} from "@lib/input";
import { Context } from "@app/types";
import { Graph, GraphNode } from "@lib/graph/Graph";
import { Vec2 } from "@lib/math";
import { AStar } from "./24-astar";

interface Node extends GraphNode {
    pos: Vec2;
}

type Blizzard = {
    start: Vec2;
    direction: Vec2;
};

const DIR = {
    ">": new Vec2(1, 0),
    "<": new Vec2(-1, 0),
    v: new Vec2(0, 1),
    "^": new Vec2(0, -1),
};

const BOUNDS = new Vec2();

export default function (input: string[], { logger }: Context) {
    const graph = new Graph<Node>();
    const blizzards: Array<Blizzard> = [];

    BOUNDS.x = input[0].length - 2;
    BOUNDS.y = input.length - 2;

    for (let y = 0; y < input.length - 2; y++) {
        for (let x = 0; x < input[y].length - 2; x++) {
            const node = {
                id: new Vec2(x, y).toString(),
                pos: new Vec2(x, y),
            };

            graph.addNode(node.id, node);

            if (input[y + 1][x + 1] === ".") {
                continue;
            }

            blizzards.push({
                start: new Vec2(x, y),
                direction: DIR[input[y + 1][x + 1]],
            });
        }
    }

    const start: Node = {
        id: new Vec2(0, -1).toString(),
        pos: new Vec2(0, -1),
    };

    const goal: Node = {
        id: new Vec2(input[0].length - 3, input.length - 2).toString(),
        pos: new Vec2(input[0].length - 3, input.length - 2),
    };

    graph.addNode(start.id, start);
    graph.addNode(goal.id, goal);

    for (const node of graph.getNodes()) {
        Vec2.ULRD.forEach((element) => {
            const pos = Vec2.add(element, node.pos);
            const n = graph.getNode(pos.toString());

            if (!n) {
                return;
            }

            graph.addConnection(node.id, n.id);
        });

        graph.addConnection(node.id, node.id);
    }

    const astar = new AStar(
        graph,
        () => 1,
        (from, to) => from.pos.manhattan(to.pos),
        (node, g, round) => {
            let array = [...(g.getConnections(node)?.values() ?? [])];

            array = array.filter((n) => !hasBlizzard(g.getNode(n).pos, round, blizzards));
            return array;
        },
    );

    return astar.findRoute(start, goal, 0).length;
}

function hasBlizzard(pos: Vec2, round: number, blizzards: Array<Blizzard>): boolean {
    const candidates = blizzards.filter((n) => n.start.x === pos.x || n.start.y === pos.y);

    for (const c of candidates) {
        const ic = Vec2.add(c.start, Vec2.mult(c.direction, round));

        ic.x %= BOUNDS.x;
        ic.y %= BOUNDS.y;

        if (ic.x < 0) {
            ic.x += BOUNDS.x;
        }

        if (ic.y < 0) {
            ic.y += BOUNDS.y;
        }

        if (ic.equals(pos)) {
            return true;
        }
    }

    return false;
}
