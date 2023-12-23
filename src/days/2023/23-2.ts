/* eslint-disable no-param-reassign */
import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import { MinHeap } from '@lib/collections';

import fs from 'fs';

// Neighbors
const N = [
    new Vec2(0, 1),
    new Vec2(1, 0),
    new Vec2(0, -1),
    new Vec2(-1, 0),
];

interface Node {
    id: string;
    pos: Vec2;
    edges: Edge[];
}

interface Edge {
    id: string;
    from: Node;
    to: Node;
    cost: number;
}

export default function (input: string[], { logger }: Context) {
    const graph = new Graph();

    // Get Nodes
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            const char = input[y][x];
            if (char === '#') {
                continue;
            }

            let neighbors = 0;

            const pos = new Vec2(x, y);

            for (const n of N) {
                const np = Vec2.add(pos, n);

                if (np.x < 0 || np.y < 0 || np.x >= input[0].length || np.y >= input.length) {
                    continue;
                }

                if (input[np.y][np.x] === '#') {
                    continue;
                }

                neighbors++;
            }

            if (neighbors >= 3) {
                graph.addNode({
                    id: pos.toString(),
                    pos,
                    edges: [],
                });
            }
        }
    }

    graph.addNode({
        id: new Vec2(1, 0).toString(),
        pos: new Vec2(1, 0),
        edges: [],
    });

    graph.addNode({
        id: new Vec2(input[0].length - 2, input.length - 1).toString(),
        pos: new Vec2(input[0].length - 2, input.length - 1),
        edges: [],
    });

    // Get Edges
    [...graph.getNodes()].forEach((node) => {
        const open: Array<[Vec2, number]> = [[node.pos, 0]];
        const seen = new Set<string>();

        while (open.length > 0) {
            const [pos, cost] = open.shift()!;

            if (seen.has(pos.toString())) {
                continue;
            }

            seen.add(pos.toString());

            const nn = graph.getNode(pos.toString());

            if (cost > 0 && nn !== undefined) {
                graph.addEdge({
                    id: `${node.id}-${nn.id}`,
                    from: node,
                    to: nn,
                    cost,
                });

                continue;
            }

            for (const n of N) {
                const np = Vec2.add(pos, n);

                if (np.x < 0 || np.y < 0 || np.x >= input[0].length || np.y >= input.length) {
                    continue;
                }

                if (input[np.y][np.x] === '#') {
                    continue;
                }

                open.push([np, cost + 1]);
            }
        }
    });

    graph.dot();

    return graph.findLongest(new Vec2(1, 0), new Vec2(input[0].length - 2, input.length - 1));
}

class Graph {
    private nodes: Map<string, Node> = new Map<string, Node>();

    private edges: Map<string, Edge> = new Map<string, Edge>();

    public getNodes(): IterableIterator<Node> {
        return this.nodes.values();
    }

    public addNode(node: Node): void {
        this.nodes.set(node.id, node);
    }

    public getNode(id: string): Node | undefined {
        return this.nodes.get(id);
    }

    public addEdge(edge: Edge): void {
        edge.from.edges.push(edge);
        this.edges.set(edge.id, edge);
    }

    public dot(): void {
        const lines: string[] = [];

        lines.push('digraph G {');

        this.nodes.forEach((node) => {
            lines.push(`  "${node.pos.x}v${node.pos.y}" [label="${node.id}"];`);
        });

        this.edges.forEach((edge) => {
            lines.push(`  "${edge.from.pos.x}v${edge.from.pos.y}" -> "${edge.to.pos.x}v${edge.to.pos.y}" [label="${edge.cost}"];`);
        });

        lines.push('}');

        fs.writeFileSync('debug.dot', lines.join('\n'));
    }

    public findLongest(from: Vec2, to: Vec2): number {
        const seen = new Set<string>();

        function dfs(node: Node): number {
            if (node.pos.equals(to)) {
                return 0;
            }

            let m = Number.MIN_SAFE_INTEGER;

            seen.add(node.id);
            for (const edge of node.edges) {
                if (seen.has(edge.to.id)) {
                    continue;
                }
                m = Math.max(m, dfs(edge.to) + edge.cost);
            }
            seen.delete(node.id);

            return m;
        }

        return dfs(this.getNode(from.toString())!);
    }
}
