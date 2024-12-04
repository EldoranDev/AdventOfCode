import { MinHeap } from "@lib/collections";
import { Heap } from "@lib/collections/Heap";
import { Graph, GraphNode } from "./Graph";
import { RouteFinder } from "./RouteFinder";

class RouteNode<K> {
    public constructor(
        public readonly current: K,
        public previous: K = null,
        public score: number = 0,
        public estimatedScore: number = 0,
    ) {}

    public compareTo(node: RouteNode<K>): number {
        if (this.estimatedScore > node.estimatedScore) {
            return 1;
        }
        if (this.estimatedScore < node.estimatedScore) {
            return -1;
        }
        return 0;
    }
}

export type Scorer<K> = (from: K, to: K) => number;

export class AStar<K extends GraphNode> implements RouteFinder<K> {
    public constructor(
        private readonly graph: Graph<K>,
        private readonly routeScorerer: Scorer<K>,
        private readonly heuristicScorer: Scorer<K>,
    ) {}

    findRoute(from: K, to: K): K[] {
        const openSet: Heap<RouteNode<K>> = new MinHeap<RouteNode<K>>();
        const allNodes: Map<string, RouteNode<K>> = new Map();

        const start = new RouteNode<K>(from, null, 0, this.heuristicScorer(from, to));

        allNodes.set(from.id, start);
        openSet.push(start, 0);

        while (openSet.length > 0) {
            const next = openSet.shift();

            if (next.current.id === to.id) {
                const route = [next.current];
                let current = next;

                do {
                    route.push(current.current);
                    current = allNodes.get(current.previous?.id);
                } while (current != null);

                route.shift();
                route.pop();

                return route;
            }

            [...(this.graph.getConnections(next.current)?.values() ?? [])].forEach((c) => {
                let node = allNodes.get(c);

                if (!node) {
                    node = new RouteNode<K>(this.graph.getNode(c), null, Number.MAX_SAFE_INTEGER);
                }

                allNodes.set(c, node);

                const newScore = next.score + this.routeScorerer(next.current, node.current);

                if (newScore < node.score) {
                    node.previous = next.current;
                    node.score = newScore;
                    node.estimatedScore = newScore + this.heuristicScorer(node.current, to);

                    openSet.push(node, node.estimatedScore);
                }
            });
        }

        return [];
    }
}
