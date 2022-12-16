export interface GraphNode {
    id: string;
}

export class Graph<V extends GraphNode> {
    private nodes: Map<string, V> = new Map<string, V>();

    private connections: Map<string, Set<string>> = new Map();

    public get size(): number {
        return this.nodes.size;
    }

    public addNode(id: string, node: V): void {
        this.nodes.set(id, node);
    }

    public addConnection(from: string, to: string): void {
        if (!this.connections.has(from)) {
            this.connections.set(from, new Set<string>());
        }

        this.connections.get(from).add(to);
    }

    public getNode(id: string): V {
        return this.nodes.get(id);
    }

    public getConnections(node: V): Set<string> {
        return this.connections.get(node.id);
    }

    public getNodes(): IterableIterator<V> {
        return this.nodes.values();
    }
}
