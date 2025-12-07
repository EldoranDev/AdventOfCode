import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

export default function (input: string[], { logger }: Context) {
    const map = input.map((l) => l.split(""));

    const start = map[0].indexOf("S");

    map[0][start] = ".";

    return count(new Vec2(start, 0), map);
}

const CACHE: Map<string, number> = new Map<string, number>();

function count(start: Vec2, map: string[][]): number {
    if (CACHE.has(start.toString())) {
        return CACHE.get(start.toString());
    }

    const pos = start.clone();

    while (true) {
        if (pos.y >= map.length) {
            CACHE.set(start.toString(), 1);

            return 1;
        }

        if (map[pos.y][pos.x] === ".") {
            pos.add(new Vec2(0, 1));
            continue;
        }

        if (map[pos.y][pos.x] === "^") {
            const res =
                count(new Vec2(pos.x - 1, pos.y), map) + count(new Vec2(pos.x + 1, pos.y), map);

            CACHE.set(start.toString(), res);

            return res;
        }
    }
}
