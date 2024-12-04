import {} from "@lib/input";
import { Context } from "@app/types";
import { Graph, GraphNode } from "@lib/graph/Graph";
import { Vec2 } from "@lib/math";
import { AStar } from "@lib/graph/AStar";

interface Point extends GraphNode {
    height: number;
    pos: Vec2;
}

export default function (input: string[], { logger }: Context) {
    const graph = new Graph<Point>();

    let S: string | null = null;
    let E: string | null = null;

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            const pos = new Vec2(x, y);
            const height = toNum(input[y][x]);

            if (input[y][x] === "S") {
                S = pos.toString();
            }

            if (input[y][x] === "E") {
                E = pos.toString();
            }

            graph.addNode(pos.toString(), {
                id: pos.toString(),
                pos,
                height,
            });

            for (const dir of Vec2.ULRD) {
                const p = Vec2.add(pos, dir);

                if (p.x < 0 || p.y < 0 || p.x >= input[y].length || p.y >= input.length) {
                    continue;
                }

                const ph = toNum(input[p.y][p.x]);

                if (ph > height && ph - height > 1) {
                    continue;
                }

                graph.addConnection(pos.toString(), p.toString());
            }
        }
    }

    const astar = new AStar(
        graph,
        () => 1,
        (from, to) => from.pos.manhattan(to.pos),
    );

    const route = astar.findRoute(graph.getNode(S), graph.getNode(E));

    return route.length - 2;
}

function toNum(char: string): number {
    if (char === "S") {
        return "a".charCodeAt(0);
    }

    if (char === "E") {
        return "z".charCodeAt(0);
    }

    return char.charCodeAt(0);
}
