import {} from "@lib/input";
import { Context } from "@app/types";

import fs from "fs";

interface Cable {
    a: Node;
    b: Node;
}

interface Node {
    id: string;
    cables: Cable[];
}

export default function (input: string[], { logger }: Context) {
    const cables = new Map<string, Cable>();
    const nodes = new Map<string, Node>();

    for (const line of input) {
        const [aId, list] = line.split(":").map((x) => x.trim());

        if (!nodes.has(aId)) {
            nodes.set(aId, { id: aId, cables: [] });
        }

        const a = nodes.get(aId);

        for (const bId of list.split(" ")) {
            if (!nodes.has(bId)) {
                nodes.set(bId, { id: bId, cables: [] });
            }

            const b = nodes.get(bId);

            const cable = { a, b };

            a.cables.push(cable);
            b.cables.push(cable);

            cables.set(`${aId}-${bId}`, cable);
        }
    }

    const CHECK_NODE = [...nodes.keys()][0];
    const NODE_COUNT = countClusters(CHECK_NODE, nodes, []);

    dot(cables);

    logger.info(`Original Cluster Size: ${NODE_COUNT}`);

    // Cables found by hand by looking at the graph in debug.dot
    // dot -Tpng -Kneato graphs/2023-25-1.dot > graphs/2023-25-1.png
    const clusterSize = countClusters(CHECK_NODE, nodes, ["fch-fvh", "nvg-vfj", "sqh-jbz"]);

    logger.info(`New cluster Size: ${clusterSize}`);

    return clusterSize * (NODE_COUNT - clusterSize);
}

function countClusters(
    nodeId: string,
    nodes: Map<string, Node>,
    removedCables: Array<string>,
): number {
    const open = [nodeId];
    const seen = new Set<string>();

    while (open.length > 0) {
        const current = open.pop();

        if (seen.has(current)) {
            continue;
        }

        seen.add(current);

        const node = nodes.get(current);

        for (const cable of node.cables) {
            if (removedCables.includes(`${cable.a.id}-${cable.b.id}`)) {
                continue;
            }

            open.push(cable.a.id === current ? cable.b.id : cable.a.id);
        }
    }

    return seen.size;
}

function dot(cables: Map<string, Cable>): void {
    const lines = [];

    lines.push("digraph G {");

    for (const cable of cables.values()) {
        lines.push(`    ${cable.a.id} -> ${cable.b.id};`);
    }

    lines.push("}");

    fs.writeFileSync("graphs/2023-25-1.dot", lines.join("\n"));
}
