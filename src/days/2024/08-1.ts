import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { pairs } from "@lib/array";

const FREE = ".";

export default function (input: string[], { logger }: Context) {
    const antennas = new Map<string, Vec2[]>();
    const antinodes = new Set<string>();

    const max = new Vec2(input[0].length, input.length);

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            const p = input[y][x];

            if (p === FREE) {
                continue;
            }

            if (!antennas.has(p)) {
                antennas.set(p, []);
            }

            antennas.get(p).push(new Vec2(x, y));
        }
    }

    for (const [, ant] of antennas) {
        for (const pair of pairs(ant)) {
            const diff = Vec2.sub(pair[1], pair[0]);

            const p1 = Vec2.sub(pair[0], diff);
            const p2 = Vec2.add(pair[1], diff);

            if (p1.x >= 0 && p1.x < max.x && p1.y >= 0 && p1.y < max.y) {
                antinodes.add(p1.toString());
            }

            if (p2.x >= 0 && p2.x < max.x && p2.y >= 0 && p2.y < max.y) {
                antinodes.add(p2.toString());
            }
        }
    }

    return antinodes.size;
}
