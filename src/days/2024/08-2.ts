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
            for (const dir of [Vec2.sub(pair[1], pair[0]), Vec2.sub(pair[0], pair[1])]) {
                const d = pair[0].clone();

                while (d.x >= 0 && d.x < max.x && d.y >= 0 && d.y < max.y) {
                    antinodes.add(d.toString());
                    d.add(dir);
                }
            }
        }
    }

    return antinodes.size;
}
