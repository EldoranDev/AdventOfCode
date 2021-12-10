export interface GraphNode {
    id: string;
}

export class Graph<V extends GraphNode> {
    private nodes: Map<string, V> = new Map<string, V>();
    private connections: Map<string, Set<string>> = new Map();
    
    public getPath(from: string, to: string): V[] {
        let path = [];

        return path;
    }

    public getNode(id: string): V {
        return this.nodes.get(id);
    }

    public getConnections(node: V): Set<string> {
        return this.connections.get(node.id);
    }
}
