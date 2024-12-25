import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { getColumn } from "@lib/array2d";

export default function (input: string[], { logger }: Context) {
    const schematics = getLineGroups(input);

    const keys: Array<number[]> = [];
    const locks: Array<number[]> = [];

    for (const schematic of schematics) {
        const heights = [];
        const m = schematic.map((line) => line.split(""));

        for (let i = 0; i < schematic[0].length; i++) {
            const col = getColumn(m, i);

            heights.push(getHeight(col));
        }

        if (m[0][0] === "#") {
            locks.push(heights);
        } else {
            keys.push(heights);
        }
    }

    let count = 0;

    for (const lock of locks) {
        for (const key of keys) {
            if (checkFit(lock, key)) {
                count++;
            }
        }
    }

    return count;
}

function checkFit(lock: number[], key: number[]): boolean {
    for (let i = 0; i < lock.length; i++) {
        if (lock[i] + key[i] > 5) {
            return false;
        }
    }

    return true;
}

function getHeight(column: string[]): number {
    if (column[0] !== "#") {
        column.reverse();
    }

    let height = 0;

    while (column[height] === "#") {
        height++;
    }

    return height - 1;
}
