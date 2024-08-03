import { } from '@lib/input';
import { Context } from '@app/types';
import { Graph, GraphNode } from '@lib/graph/Graph';

export default function (input: string[], { logger }: Context) {
    const graph = new Graph();

    for (const line of input) {
        const split = line.split('<->');

        const node: GraphNode = {
            id: split[0].trim(),
        };

        graph.addNode(node.id, node);

        for (const con of split[1].trim().split(',').map((s) => s.trim())) {
            graph.addConnection(node.id, con);
            graph.addConnection(con, node.id);
        }
    }

    const group = [];

    const open = ['0'];

    while (open.length > 0) {
        const current = open.pop();

        const conns = graph.getConnections(graph.getNode(current));

        for (const con of conns) {
            if (group.includes(con)) {
                continue;
            }

            group.push(con);
            open.push(con);
        }
    }

    return group.length;
}
