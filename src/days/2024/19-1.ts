import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { memoize } from "@lib/functools";

const TOWELS: Set<string> = new Set<string>();

export default function (input: string[], { logger }: Context) {
    const [towelsInput, patterns] = getLineGroups(input);

    towelsInput[0].split(",").forEach((towel) => TOWELS.add(towel.trim()));

    const possible = patterns.filter((pattern) => arrange(pattern));

    return possible.length;
}

function arrange(pattern: string): boolean {
    if (pattern === "") {
        return true;
    }

    for (let i = 0; i < pattern.length; i++) {
        const sub = pattern.substring(0, pattern.length - i);

        if (TOWELS.has(sub)) {
            const aragement = memArrange(pattern.substring(pattern.length - i));

            if (aragement) {
                return true;
            }
        }
    }

    return false;
}

const memArrange = memoize(arrange);
