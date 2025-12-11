import {} from "@lib/input";
import { Context } from "@app/types";
import { memoize } from "@lib/functools";

const GRAPH = new Map<string, string[]>();

const START_NODE = "you";
const TARGET_NODE = "out";

export default function (input: string[], { logger }: Context) {
    input.forEach((l) => {
        const [node, connections] = l.split(":");

        GRAPH.set(node, connections.trim().split(" "));
    });

    return getPath(START_NODE);
}

const getPath = memoize((node: string): number => {
    if (node === TARGET_NODE) {
        return 1;
    }

    let sum = 0;

    for (const n of GRAPH.get(node)) {
        sum += getPath(n);
    }

    return sum;
});
