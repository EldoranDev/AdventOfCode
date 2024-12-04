import {} from "@lib/input";
import { Context } from "@app/types";
import { create } from "@lib/array2d";
import { Vec2 } from "@lib/math";

export default function (input: string[], { logger }: Context) {
    const map = create(input[0].length, input.length, 0);

    for (let y = 0; y < input.length; y++) {
        const cols = input[y].split("");

        for (let x = 0; x < input[y].length; x++) {
            map[y][x] = Number(cols[x]);
        }
    }

    const ALL = map[0].length * map.length;

    const adjacents = [
        new Vec2(0, 1),
        new Vec2(0, -1),
        new Vec2(1, -1),
        new Vec2(-1, 1),
        new Vec2(-1, -1),
        new Vec2(1, 1),
        new Vec2(1, 0),
        new Vec2(-1, 0),
    ];

    let count = 0;

    for (let r = 0; ; r++) {
        let hadChange = false;

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                map[y][x] += 1;
            }
        }

        const flashed = new Set<Vec2>();

        do {
            hadChange = false;

            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    const pos = new Vec2(x, y);

                    if (map[y][x] > 9) {
                        if (flashed.has(pos)) {
                            continue;
                        }

                        count += 1;
                        hadChange = true;

                        for (const adj of adjacents) {
                            const ap = Vec2.add(adj, pos);

                            if (map[ap.y] !== undefined && map[ap.y][ap.x] !== undefined) {
                                map[ap.y][ap.x] += 1;
                            }
                        }

                        flashed.add(pos);
                    }
                }
            }

            for (const p of flashed) {
                map[p.y][p.x] = 0;
            }
        } while (hadChange);

        logger.debug("\n" + map.map((row) => row.join("")).join("\n"));

        if (flashed.size === ALL) {
            return r + 1;
        }
    }
}
