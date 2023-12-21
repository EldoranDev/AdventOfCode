import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import { Grid2D, create } from '@lib/array2d';
import { memoize } from '@lib/functools';

let MAP: Grid2D<string> = null;

// 6  for testing input
// 64 for real input
const STEPS = 64;
const REACHABLE = new Set<string>();

const getReachableMem = memoize(getReachable);

const DIRS = [
    new Vec2(1, 0),
    new Vec2(0, 1),
    new Vec2(-1, 0),
    new Vec2(0, -1),
];

export default function (input: string[], { logger }: Context) {
    MAP = create<string>(input[0].length, input.length, '.');
    let start: Vec2 = null;

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] === 'S') {
                start = new Vec2(x, y);
                MAP[y][x] = '.';
                continue;
            }

            MAP[y][x] = input[y][x];
        }
    }

    if (start === null) {
        throw new Error('Parsing Error: No start found');
    }

    getReachableMem(start, STEPS);

    return REACHABLE.size;
}

function getReachable(pos: Vec2, steps: number) {
    if (steps === 0) {
        REACHABLE.add(pos.toString());
        return;
    }

    for (const neighbor of DIRS) {
        const np = Vec2.add(pos, neighbor);

        if (np.x < 0 || np.y < 0 || np.x >= MAP[0].length || np.y >= MAP.length) {
            continue;
        }

        if (MAP[np.y][np.x] === '#') {
            continue;
        }

        getReachableMem(np, steps - 1);
    }
}
