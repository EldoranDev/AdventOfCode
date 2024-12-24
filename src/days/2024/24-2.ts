import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { writeFile } from "node:fs/promises";

type Op = "AND" | "OR" | "XOR";

interface Gate {
    a: string;
    b: string;
    out: string;

    op: Op;
}

const EXTRACTOR = /(.{3}) (AND|XOR|OR) (.{3}) -> (.{3})/;

export default async function (input: string[], { logger }: Context) {
    const wires = new Map<string, boolean>();
    const gates: Gate[] = [];

    const result = new Map<string, boolean>();

    const [wiresIn, gatesIn] = getLineGroups(input);

    wiresIn.forEach((wire) => {
        const [id, value] = wire.split(":");

        wires.set(id, value.trim() === "1");
    });

    gatesIn.forEach((gate) => {
        const [, a, op, b, out] = EXTRACTOR.exec(gate);
        const g: Gate = {
            a,
            b,
            out,
            op: op as Op,
        };

        gates.push(g);

        // fixes
        // manually found by inspecting the generated graph
        if (g.a === "x13" && g.b === "y13") {
            g.out = "vcv";
        }

        if (g.a === "mks" && g.b === "bhr") {
            g.out = "z13";
        }

        if (g.a === "vbw" && g.b === "qkk" && op === "OR") {
            g.out = "mps";
        }

        if (a === "mqj" && b === "pqn" && op === "XOR") {
            g.out = "z25";
        }

        if (a === "csn" && b === "nmn" && op === "AND") {
            g.out = "vwp";
        }

        if (a === "csn" && b === "nmn" && op === "XOR") {
            g.out = "z19";
        }

        if (a === "x33" && b === "y33" && op === "AND") {
            g.out = "vjv";
        }

        if (a === "x33" && b === "y33" && op === "XOR") {
            g.out = "cqm";
        }
    });

    return ["vcv", "z13", "mps", "z25", "vwp", "z19", "vjv", "cqm"].sort().join(",");

    // Graph file to detect errors
    await writeFile("./output.dot", createGraph(gates));

    while (gates.length > 0) {
        const gate = gates.shift();

        if (!wires.has(gate.a) || !wires.has(gate.b)) {
            gates.push(gate);
            continue;
        }

        wires.set(gate.out, compute(wires.get(gate.a), wires.get(gate.b), gate.op));

        if (gate.out.startsWith("z")) {
            result.set(gate.out, wires.get(gate.out));
        }
    }

    return resultMapToNumber(result);
}

function compute(a: boolean, b: boolean, op: Op): boolean {
    switch (op) {
        case "AND":
            return a && b;
        case "OR":
            return a || b;
        case "XOR":
            return a !== b;
    }
}

function resultMapToNumber(map: Map<string, boolean>): bigint {
    return [...map.entries()]
        .sort((a, b) => b[0].localeCompare(a[0]))
        .reduce((prev, [, bit]) => {
            prev <<= BigInt(1);
            prev += BigInt(bit);

            return BigInt(prev);
        }, BigInt(0));
}

function createGraph(gates: Gate[]) {
    let graph = "";

    gates.sort((a, b) => {
        if (a.a.startsWith("x")) {
            if (b.a.startsWith("x")) {
                return a.a.localeCompare(b.a);
            }

            return -1;
        }

        a.a.localeCompare(b.a);
    });

    for (const gate of gates) {
        graph += `"${gate.a}" -> "${gate.a}-${gate.op}-${gate.b}"\n`;
        graph += `"${gate.b}" -> "${gate.a}-${gate.op}-${gate.b}"\n`;
        graph += `"${gate.a}-${gate.op}-${gate.b}" -> ${gate.out}\n`;
    }

    return `digraph G {\n${graph}\n}`;
}
