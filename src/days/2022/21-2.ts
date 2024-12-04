import {} from "@lib/input";
import { Context } from "@app/types";

interface Node {
    id: string;
    a?: Node;
    b?: Node;
    parent?: Node;
    op?: string;
    value?: number;
}

interface PreNode {
    a?: string;
    b?: string;
    op?: string;
    value?: number;
}

const E = /([a-z]{4})\s([+\-*/])\s([a-z]{4})/;

const OPS = {
    "*": (a: number, b: number) => a * b,
    "+": (a: number, b: number) => a + b,
    "-": (a: number, b: number) => a - b,
    "/": (a: number, b: number) => (a / b) | 0,
    "=": (a: number, b: number) => a === b,
};

const INV = {
    "*": [(y, a) => y / a, (y, b) => y / b],
    "+": [(y, a) => y - a, (y, b) => y - b],
    "-": [(y, a) => a - y, (y, b) => b + y],
    "/": [(y, a) => a / y, (y, b) => b * y],
};

const HUMAN = "humn";

export default function (input: string[], { logger }: Context) {
    const preNodes = new Map<string, PreNode>();
    const nodes = new Map<string, Node>();

    for (const line of input) {
        const [monkey, term] = line.split(":");

        const match = E.exec(term);

        if (match) {
            const [, a, op, b] = match;
            preNodes.set(monkey, {
                a,
                b,
                op,
            });
            nodes.set(monkey, {
                id: monkey,
                op,
            });
        } else {
            preNodes.set(monkey, {
                value: +term.trim(),
            });
            nodes.set(monkey, {
                id: monkey,
                value: +term.trim(),
            });
        }
    }

    for (const [key, value] of preNodes) {
        if (value.value) {
            continue;
        }

        const node = nodes.get(key);

        const a = nodes.get(value.a);
        const b = nodes.get(value.b);

        node.a = a;
        node.b = b;
        a.parent = node;
        b.parent = node;
    }

    let replaced = true;

    while (replaced) {
        replaced = false;

        for (const [key, value] of nodes.entries()) {
            if (typeof value.value === "number") {
                continue;
            }

            if (value.a.id === HUMAN || value.b.id === HUMAN) {
                continue;
            }

            if (!value.a.value || !value.b.value) {
                continue;
            }

            value.value = OPS[value.op](value.a.value, value.b.value);
            replaced = true;
        }
    }

    const root = nodes.get("root");
    nodes.get(HUMAN).value = null;

    let node = root;
    let value: number = root.a.value ? root.a.value : root.b.value;

    while (node.id !== HUMAN) {
        node = node.a.value ? node.b : node.a;
        if (!node.a || !node.b) {
            return value;
        }

        const op = INV[node.op];

        if (node.a.value) {
            value = op[0](value, node.a.value);
        } else {
            value = op[1](value, node.b.value);
        }
    }

    return 0;
}
