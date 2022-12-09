import { } from '@lib/input';
import { Context } from '@app/types';
import { create, getColumn } from '@lib/array2d';
import { Vec2 } from '@lib/math';

const LEFT = 0b0001;
const RIGHT = 0b0010;
const TOP = 0b0100;
const BOT = 0b1000;

let grid: number[][];

export default function (input: string[], { logger }: Context) {
    grid = create<number>(input[0].length, input.length);

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            grid[y][x] = Number(input[y][x]);
        }
    }

    let top = 0;

    for (let y = 1; y < grid.length - 1; y++) {
        for (let x = 1; x < grid[y].length - 1; x++) {
            if (canIgnore(y, x)) {
                continue;
            }

            const score = getScore(y, x);

            if (score > top) {
                top = score;
            }
        }
    }

    return top;
}

const IGNORE_RUES = [
    { os: new Vec2(0, -1), cond: TOP },
    { os: new Vec2(0, 1), cond: BOT },
    { os: new Vec2(-1, 0), cond: RIGHT },
    { os: new Vec2(1, 0), cond: LEFT },
];

function canIgnore(y: number, x: number): boolean {
    for (const rule of IGNORE_RUES) {
        if ((grid[y + rule.os.y][x + rule.os.x] & rule.cond) > grid[y][x]) {
            return true;
        }
    }

    return false;
}

const DIRECTIONS: Vec2[] = [
    new Vec2(0, 1),
    new Vec2(0, -1),
    new Vec2(1, 0),
    new Vec2(-1, 0),
];

function getScore(y: number, x: number): number {
    let score = 1;

    for (const d of DIRECTIONS) {
        const pos = new Vec2(x, y);
        let blocked = false;
        let dirScore = 0;

        while (!blocked) {
            pos.add(d);

            if (pos.x < 0 || pos.y < 0 || pos.x === grid[0].length || pos.y === grid.length) {
                blocked = true;
                continue;
            }

            dirScore++;

            if (grid[pos.y][pos.x] >= grid[y][x]) {
                blocked = true;
            }
        }
        score *= dirScore;
    }

    return score;
}
