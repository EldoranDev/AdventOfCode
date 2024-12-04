/* eslint-disable max-len */
import {} from "@lib/input";
import { Context } from "@app/types";
import { memoize } from "@lib/functools";

interface Row {
    springs: string;
    groups: number[];
}

const findValidMem = memoize(findValid);

export default function (input: string[], { logger }: Context) {
    const lines: Row[] = input.map((line) => {
        const row = line.split(" ");

        const springs = row[0];
        const groups = row[1].split(",").map((v) => parseInt(v, 10));

        return {
            springs,
            groups,
        };
    });

    const result = lines.reduce((acc, row) => acc + findValidMem(row.springs, row.groups), 0);

    return result;
}

function findValid(row: string, groups: number[]): number {
    // Check if this can already be evaluated
    if (row.includes("?")) {
        const index = row.indexOf("?");

        // Reduce Search Space
        const g = row
            .slice(0, index)
            .split(".")
            .filter((v) => v !== "");
        const rowGroups = row.split(".").filter((v) => v !== "");

        // This can not turn out to be a valid configuration anymore
        if (g.length > groups.length) {
            return 0;
        }

        // Only checking n-1 groups so that we are sure not to exclude anything
        for (let i = 0; i < g.length - 1; i++) {
            // Missmatch in already configured groups so it will not work
            if (g[i].length !== groups[i]) {
                return 0;
            }

            groups.shift();
            rowGroups.shift();
        }

        const newString = rowGroups.join(".");
        const newIndex = newString.indexOf("?");

        // Check possibilities
        return (
            findValidMem(`${newString.slice(0, newIndex)}.${newString.slice(newIndex + 1)}`, [
                ...groups,
            ]) +
            findValidMem(`${newString.slice(0, newIndex)}#${newString.slice(newIndex + 1)}`, [
                ...groups,
            ])
        );
    }

    // If there is no more question marks check if its valid:
    const g = row.split(".").filter((v) => v !== "");

    if (g.length !== groups.length) {
        return 0;
    }

    for (let i = 0; i < g.length; i++) {
        if (g[i].length !== groups[i]) {
            return 0;
        }
    }

    return 1;
}
