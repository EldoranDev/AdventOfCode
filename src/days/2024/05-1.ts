import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const rules = new Map<number, number[]>();

    const [rawRules, rawUpdates] = getLineGroups(input);

    rawRules
        .map((line) => line.split("|").map((e) => Number(e)))
        .forEach(([a, b]) => {
            if (!rules.has(a)) {
                rules.set(a, []);
            }

            rules.get(a).push(b);
        });

    const updates = rawUpdates.map((line) => line.split(",").map((e) => Number(e)));

    let sum = 0;

    for (const update of updates) {
        if (isValid(update, rules)) {
            sum += update[(update.length / 2) | 0];
        }
    }

    return sum;
}

function isValid(update: number[], rules: Map<number, number[]>): boolean {
    for (let i = 0; i < update.length; i++) {
        if (!rules.has(update[i])) {
            continue;
        }

        const checks = rules.get(update[i]);

        for (const check of checks) {
            const index = update.indexOf(check);
            if (index >= 0 && index < i) {
                return false;
            }
        }
    }

    return true;
}
