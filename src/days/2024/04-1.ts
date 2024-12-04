import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

const DIRS: Vec2[] = [
    new Vec2(0, -1),
    new Vec2(0, 1),
    new Vec2(-1, 0),
    new Vec2(1, 0),
    new Vec2(-1, -1),
    new Vec2(1, 1),
    new Vec2(-1, 1),
    new Vec2(1, -1),
];

const WORD = ['X', 'M', 'A', 'S'];

export default function (input: string[], { logger }: Context) {
    let count = 0;

    for (let y = 0; y < input.length; y++) {
        let x = input[y].indexOf(WORD[0]);

        while (x !== -1) {
            count += check(new Vec2(x, y), input);

            x = input[y].indexOf(WORD[0], x + 1);
        }
    }

    return count;
}

function check(pos: Vec2, grid: string[]): number {
    let count = 0;

    for (const dir of DIRS) {
        let match = true;

        for (let i = 0; i < WORD.length; i++) {
            const p = Vec2.add(pos, Vec2.mult(dir, i));

            if (p.y < 0 || p.y >= grid.length || p.x < 0 || p.x >= grid[p.y].length || grid[p.y][p.x] !== WORD[i]) {
                match = false;
                break;
            }
        }

        if (match) {
            count++;
        }
    }

    return count;
}
