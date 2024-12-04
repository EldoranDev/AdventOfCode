/* eslint-disable no-labels */
import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

interface Reflection {
    x?: number;
    y?: number;

    direction: "horizontal" | "vertical";
}

interface Pattern {
    rows: number[];
    columns: number[];
}

export default function (input: string[], { logger }: Context) {
    return getLineGroups(input)
        .map(getPattern)
        .map(findReflection)
        .reduce(
            (acc, reflection) =>
                acc + (reflection.direction === "horizontal" ? reflection.y * 100 : reflection.x),
            0,
        );
}

function getPattern(lines: string[]): Pattern {
    const pattern: Pattern = {
        rows: Array.from({ length: lines.length }, () => 0),
        columns: Array.from({ length: lines[0].length }, () => 0),
    };

    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const value = lines[y][x] === "#" ? 1 : 0;

            pattern.rows[y] <<= 1;
            pattern.rows[y] |= value;

            pattern.columns[x] <<= 1;
            pattern.columns[x] |= value;
        }
    }

    return pattern;
}

function findReflection(pattern: Pattern): Reflection {
    outer: for (let y = 1; y < pattern.rows.length; y++) {
        let nudged = false;

        for (let yy = 0; y - yy - 1 >= 0 && y + yy < pattern.rows.length; yy++) {
            const diff = pattern.rows[y - yy - 1] ^ pattern.rows[y + yy];

            if (diff === 0) continue;

            if ((diff & (diff - 1)) !== 0) {
                continue outer;
            }

            if (nudged) {
                continue outer;
            }

            nudged = true;
        }

        if (nudged) {
            return {
                y,
                direction: "horizontal",
            };
        }
    }

    outer: for (let x = 1; x < pattern.columns.length; x++) {
        let nudged = false;

        for (let xx = 0; x - xx - 1 >= 0 && x + xx < pattern.columns.length; xx++) {
            const diff = pattern.columns[x - xx - 1] ^ pattern.columns[x + xx];

            if (diff === 0) continue;

            if ((diff & (diff - 1)) !== 0) {
                continue outer;
            }

            if (nudged) {
                continue outer;
            }

            nudged = true;
        }

        if (nudged) {
            return {
                x,
                direction: "vertical",
            };
        }
    }

    throw new Error("No reflection found");
}
