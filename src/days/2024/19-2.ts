import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { memoize } from "@lib/functools";

const TOWELS: Set<string> = new Set<string>();

export default function (input: string[], { logger }: Context) {
    const [towelsInput, patterns] = getLineGroups(input);

    towelsInput[0].split(",").forEach((towel) => TOWELS.add(towel.trim()));

    const sum = patterns.reduce((prev, curr) => prev + arrange(curr), 0);

    return sum;
}

function arrange(pattern: string): number {
    if (pattern === "") {
        return 1;
    }

    let sum = 0;

    for (let i = 0; i < pattern.length; i++) {
        const sub = pattern.substring(0, pattern.length - i);

        if (TOWELS.has(sub)) {
            sum += memArrange(pattern.substring(pattern.length - i));
        }
    }

    return sum;
}

const memArrange = memoize(arrange);
