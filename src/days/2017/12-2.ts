import {} from "@lib/input";
import { Context } from "@app/types";
import { Graph, GraphNode } from "@lib/graph/Graph";
import { range } from "@lib/math/functions";

export default function (input: string[], { logger }: Context) {
    const graph = new Graph();

    for (const line of input) {
        const split = line.split("<->");

        const node: GraphNode = {
            id: split[0].trim(),
        };

        graph.addNode(node.id, node);

        for (const con of split[1]
            .trim()
            .split(",")
            .map((s) => s.trim())) {
            graph.addConnection(node.id, con);
            graph.addConnection(con, node.id);
        }
    }

    let groups = 0;

    const all = range(input.length, 0).map((n) => n.toString());

    while (all.length > 0) {
        const open = [all.shift()];
        const closed = [];

        groups++;

        while (open.length > 0) {
            const current = open.pop();

            const conns = graph.getConnections(graph.getNode(current));

            for (const con of conns) {
                if (closed.includes(con)) {
                    continue;
                }

                const index = all.indexOf(con);

                if (index !== -1) {
                    all.splice(index, 1);
                }

                closed.push(con);
                open.push(con);
            }
        }
    }

    return groups;
}
