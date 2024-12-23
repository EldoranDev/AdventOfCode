import {} from "@lib/input";
import { Context } from "@app/types";
import { create, getColumn } from "@lib/array2d";
import { Vec2 } from "@lib/math";

const EXPANSION = 1;

interface Galaxy {
    id: number;
    position: Vec2;
    drift: Vec2;
}

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
                    drift: new Vec2(0, 0),
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
                    g.drift.y += EXPANSION;
                });
        }

        const col = getColumn(picture, i);
        if (col.every((v) => v === 0)) {
            // eslint-disable-next-line no-param-reassign
            galaxies
                .filter((g) => g.position.x > i)
                .forEach((g) => {
                    // eslint-disable-next-line no-param-reassign
                    g.drift.x += EXPANSION;
                });
        }
    }

    return galaxies
        .flatMap((g, i) =>
            galaxies.slice(i + 1).reduce((acc, g2) => {
                const pos1 = Vec2.add(g.position, g.drift);
                const pos2 = Vec2.add(g2.position, g2.drift);

                return acc + pos1.manhattan(pos2);
            }, 0),
        )
        .reduce((acc, v) => acc + v, 0);
}
