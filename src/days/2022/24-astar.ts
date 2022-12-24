/* eslint-disable max-len */
import { MinHeap } from '@lib/collections';
import { Heap } from '@lib/collections/Heap';
import { Graph, GraphNode } from '@lib/graph/Graph';
import { RouteFinder } from '@lib/graph/RouteFinder';

class RouteNode<K> {
    public constructor(
        public readonly current: K,
        public previous: RouteNode<K> = null,
        public score: number = 0,
        public estimatedScore: number = 0,
        public round: number = 0,
    ) {}

    public compareTo(node: RouteNode<K>): number {
        if (this.estimatedScore > node.estimatedScore) {
            return 1;
        } if (this.estimatedScore < node.estimatedScore) {
            return -1;
        }
        return 0;
    }
}

export type Scorer<K extends GraphNode> = (from: K, to: K) => number;
// eslint-disable-next-line max-len
export type ConnectionFetcher<K extends GraphNode> = (node: K, graph: Graph<K>, round: number) => Array<string>;

export class AStar<K extends GraphNode> implements RouteFinder<K> {
    public constructor(
        private readonly graph: Graph<K>,
        private readonly routeScorerer: Scorer<K>,
        private readonly heuristicScorer: Scorer<K>,
        private readonly connectionFetcher: ConnectionFetcher<K>,
    ) {}

    findRoute(from: K, to: K, roundOffset: number = 0): K[] {
        const openSet: Heap<RouteNode<K>> = new MinHeap<RouteNode<K>>();
        const allNodes: Map<string, RouteNode<K>> = new Map();

        const start = new RouteNode<K>(from, null, 0, this.heuristicScorer(from, to), roundOffset);

        allNodes.set(`${from.id}-${start.round}`, start);
        openSet.push(start, 0);

        while (openSet.length > 0) {
            const next = openSet.shift();

            if (next.current.id === to.id) {
                const route = [next.current];
                let current = next;

                do {
                    route.push(current.current);
                    current = current.previous;
                } while (current != null);

                route.shift();
                route.pop();

                return route;
            }

            this.connectionFetcher(next.current, this.graph, next.round + 1).forEach((c) => {
                let node = allNodes.get(`${c}-${next.round + 1}`);

                if (!node) {
                    node = new RouteNode<K>(this.graph.getNode(c), null, Number.MAX_SAFE_INTEGER, null, next.round + 1);
                }

                allNodes.set(`${c}-${node.round}`, node);

                const newScore = next.score + this.routeScorerer(next.current, node.current);

                if (newScore < node.score) {
                    node.previous = next;
                    node.score = newScore;
                    node.estimatedScore = newScore + this.heuristicScorer(node.current, to);

                    openSet.push(node, node.estimatedScore);
                }
            });
        }

        return [];
    }
}
