/* eslint-disable max-len */
import {} from "@lib/input";
import { Context } from "@app/types";
import { create, getColumn } from "@lib/array2d";
import { Vec2 } from "@lib/math";

const EXPANSION = 1_000_000n;

interface BigPos {
    x: bigint;
    y: bigint;
}

interface Galaxy {
    id: number;
    position: Vec2;
    drift: BigPos;
}

const abs = (a: bigint) => (a < 0n ? -a : a);

export default function (input: string[], { logger }: Context) {
    const picture = create(input[0].length, input.length, 0);
    const galaxies: Array<Galaxy> = [];

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            picture[y][x] = input[y][x] === "#" ? 1 : 0;
        }
    }

    let id = 0;

    for (let y = 0; y < picture.length; y++) {
        for (let x = 0; x < picture[y].length; x++) {
            if (picture[y][x] === 1) {
                galaxies.push({
                    id: id++,
                    position: new Vec2(x, y),
                    drift: {
                        x: 0n,
                        y: 0n,
                    },
                });
            }
        }
    }

    for (let i = 0; i < picture.length; i++) {
        if (picture[i].every((v) => v === 0)) {
            galaxies
                .filter((g) => g.position.y > i)
                .forEach((g) => {
                    // eslint-disable-next-line no-param-reassign
                    g.drift.y += EXPANSION - 1n;
                });
        }

        const col = getColumn(picture, i);
        if (col.every((v) => v === 0)) {
            // eslint-disable-next-line no-param-reassign
            galaxies
                .filter((g) => g.position.x > i)
                .forEach((g) => {
                    // eslint-disable-next-line no-param-reassign
                    g.drift.x += EXPANSION - 1n;
                });
        }
    }

    return galaxies
        .flatMap((g, i) =>
            galaxies.slice(i + 1).reduce((acc, g2) => {
                const pos1 = {
                    x: BigInt(g.position.x) + g.drift.x,
                    y: BigInt(g.position.y) + g.drift.y,
                };
                const pos2 = {
                    x: BigInt(g2.position.x) + g2.drift.x,
                    y: BigInt(g2.position.y) + g2.drift.y,
                };

                return acc + abs(pos1.x - pos2.x) + abs(pos1.y - pos2.y);
            }, 0n),
        )
        .reduce((acc, v) => acc + v, 0n);
}
