import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

type Op = "AND" | "OR" | "XOR";

interface Gate {
    a: string;
    b: string;
    out: string;

    op: Op;
}

const EXTRACTOR = /(.{3}) (AND|XOR|OR) (.{3}) -> (.{3})/;

export default function (input: string[], { logger }: Context) {
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

        gates.push({
            a,
            b,
            out,
            op: op as Op,
        });
    });

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
