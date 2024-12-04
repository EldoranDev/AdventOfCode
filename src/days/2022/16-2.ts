/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import {} from "@lib/input";
import { Context } from "@app/types";
import { Graph, GraphNode } from "@lib/graph/Graph";
import { AStar } from "@lib/graph/AStar";
import { sum } from "@lib/math/functions";
import { intersect } from "@lib/array";

interface Node extends GraphNode {
    flowRate: number;
}

interface Path {
    score: number;
    nodes: Array<string>;
}

const E = /Valve ([A-Z]{2}) has flow rate=(\d+); tunnel[s]* lead[s]? to valve[s]? ([A-Z,\W]+)/;
const G = new Graph<Node>();
const P = new AStar(
    G,
    () => 1,
    () => 1,
);

const D = new Map<string, Map<string, number>>();

const MINUTES = 26;

const PATHS: Array<Path> = [];

export default function (input: string[], { logger }: Context) {
    input.forEach((line) => {
        const [, id, rate, valves] = E.exec(line);

        G.addNode(id, {
            id,
            flowRate: Number(rate),
        });

        valves.split(",").forEach((valve: string) => {
            G.addConnection(id, valve.trim());
        });
    });

    for (const n1 of G.getNodes()) {
        for (const n2 of G.getNodes()) {
            if (n1.id === n2.id) {
                continue;
            }

            if (!D.has(n1.id)) {
                D.set(n1.id, new Map<string, number>());
            }

            const p = P.findRoute(n1, n2);
            D.get(n1.id).set(n2.id, p.length);
        }
    }

    getPressure("AA", MINUTES - 1, 0, []);

    logger.info("Done Building");

    let highest = 0;

    for (let i = 0; i < PATHS.length; i++) {
        for (let j = i; j < PATHS.length; j++) {
            if (PATHS[i].nodes.length + PATHS[i].nodes.length > G.size) {
                continue;
            }

            if (PATHS[i].score + PATHS[j].score <= highest) {
                continue;
            }

            if (intersect(PATHS[i].nodes, PATHS[j].nodes)) {
                continue;
            }

            highest = PATHS[i].score + PATHS[j].score;
            logger.info(`Highest: ${highest}`);
        }
    }

    return highest;
}

function getPressure(
    current: string,
    timeLeft: number,
    pressure: number,
    open: Array<string>,
): number {
    const pressureRate = sum(...open.map((o) => G.getNode(o).flowRate));

    pressure += pressureRate;

    // No time left
    if (timeLeft === 0) {
        PATHS.push({ score: pressure, nodes: open });
        return pressure;
    }

    if (open.length === G.size - 1) {
        return getPressure(current, timeLeft - 1, pressure, open);
    }

    const node = G.getNode(current);

    const potentials = [];

    // Should this be opend ?
    if (!open.includes(current) && node.flowRate > 0 && current !== "AA") {
        return getPressure(
            current,
            timeLeft - 1,
            pressure,
            [...open, current].sort((a, b) => a.localeCompare(b)),
        );
    }

    const candidates = [...G.getNodes()].filter((n) => {
        if (n.id === node.id) {
            return false;
        }

        if (open.includes(n.id)) {
            return false;
        }

        if (n.flowRate === 0) {
            return false;
        }

        if (timeLeft - D.get(node.id).get(n.id) < 0) {
            return false;
        }

        return true;
    });

    if (candidates.length === 0) {
        return getPressure(current, timeLeft - 1, pressure, [...open]);
    }

    for (const c of candidates) {
        const d = D.get(node.id).get(c.id);

        potentials.push(
            getPressure(c.id, timeLeft - d, pressure + pressureRate * (d - 1), [...open]),
        );
    }

    return Math.max(...potentials);
}
