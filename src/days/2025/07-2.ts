import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { memoize } from "@lib/functools";

let MAP: string[][];

export default function (input: string[], { logger }: Context) {
    MAP = input.map((l) => l.split(""));

    const start = MAP[0].indexOf("S");

    MAP[0][start] = ".";

    return count(new Vec2(start, 0));
}

const count = memoize((start: Vec2): number => {
    const pos = start.clone();

    while (true) {
        if (pos.y >= MAP.length) {
            return 1;
        }

        if (MAP[pos.y][pos.x] === ".") {
            pos.add(new Vec2(0, 1));
            continue;
        }

        if (MAP[pos.y][pos.x] === "^") {
            return count(new Vec2(pos.x - 1, pos.y)) + count(new Vec2(pos.x + 1, pos.y));
        }
    }
});
