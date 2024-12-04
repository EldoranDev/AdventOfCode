import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

const START = "AAA";
const END = "ZZZ";

export default function (input: string[], { logger }: Context) {
    const connections = new Map<string, string[]>();

    const [[directions], map] = getLineGroups(input);

    for (const line of map) {
        const [, from, left, right] = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/.exec(line)!;

        connections.set(from, [left, right]);
    }

    let current = START;

    let i = 0;
    for (; current !== END; i++) {
        const [left, right] = connections.get(current)!;

        if (directions[i % directions.length] === "L") {
            current = left;
        } else {
            current = right;
        }
    }

    return i;
}
