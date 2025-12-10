import {} from "@lib/input";
import { Context } from "@app/types";
import { equals } from "@lib/array";

const EXTRACT = /\[(?<light>[.#]+)\].(?<buttons>\(.*\)).{(?<joltage>.*)}/;

interface Machine {
    lights: boolean[];
    buttons: Array<number[]>;
    joltage: number[];
}

export default function (input: string[], { logger }: Context) {
    const machines: Machine[] = input.map((l) => {
        const e = EXTRACT.exec(l);

        const lights = e.groups["light"].split("").map((c) => c === "#");
        const buttons = e.groups["buttons"].split(" ").map((b) => {
            return b
                .substring(1, b.length - 1)
                .split(",")
                .map(Number);
        });
        const joltage = e.groups["joltage"].split(",").map(Number);

        return {
            lights,
            buttons,
            joltage,
        };
    });

    let presses = 0;

    for (const machine of machines) {
        presses += solve(machine);
    }

    return presses;
}

type Node = [boolean[], number];

function solve(machine: Machine): number {
    const queue: Node[] = [];

    const seen = new Set<string>();

    queue.push([Array(machine.lights.length).fill(false), 0]);

    while (queue.length > 0) {
        const n = queue.shift();

        if (equals(machine.lights, n[0])) {
            return n[1];
        }

        for (let i = 0; i < machine.buttons.length; i++) {
            const next = [...n[0]];

            for (const b of machine.buttons[i]) {
                next[b] = !next[b];
            }

            if (seen.has(next.join())) continue;

            seen.add(next.join());

            queue.push([next, n[1] + 1]);
        }
    }

    return Infinity;
}
