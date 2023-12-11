import { } from '@lib/input';
import { Context } from '@app/types';
import { create, getColumn } from '@lib/array2d';
import { Vec2 } from '@lib/math';

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
            picture[y][x] = input[y][x] === '#' ? 1 : 0;
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
            galaxies.filter((g) => g.position.y > i).forEach((g) => {
                // eslint-disable-next-line no-param-reassign
                g.drift.y += EXPANSION - 1n;
            });
        }

        const col = getColumn(picture, i);
        if (col.every((v) => v === 0)) {
            // eslint-disable-next-line no-param-reassign
            galaxies.filter((g) => g.position.x > i).forEach((g) => {
                // eslint-disable-next-line no-param-reassign
                g.drift.x += EXPANSION - 1n;
            });
        }
    }

    const combinations = new Set<string>();

    return galaxies.reduce((acc, galaxy) => {
        let sum = BigInt(0);

        for (const g of galaxies) {
            if (galaxy.id === g.id) {
                continue;
            }

            if (combinations.has([galaxy.id, g.id].sort().join(','))) {
                continue;
            }

            combinations.add([galaxy.id, g.id].sort().join(','));

            const pos1: BigPos = {
                x: BigInt(galaxy.position.x) + galaxy.drift.x,
                y: BigInt(galaxy.position.y) + galaxy.drift.y,
            };
            const pos2: BigPos = {
                x: BigInt(g.position.x) + g.drift.x,
                y: BigInt(g.position.y) + g.drift.y,
            };

            sum += abs(pos1.x - pos2.x) + abs(pos1.y - pos2.y);
        }

        return acc + sum;
    }, BigInt(0));
}
