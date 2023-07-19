import { } from '@lib/input';
import { Context } from '@app/types';
import { Convay } from '@lib/simulation';
import { Vec2 } from '@lib/math';
import { create } from '@lib/array2d';

const SIZE = 100;
const ROUNDS = 100;

export default function (input: string[], { logger }: Context) {
    const convay = new Convay<Vec2>(
        (pos) => {
            const neighbors = [];

            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if (!(y === x && x === 0)) {
                        neighbors.push(new Vec2(x, y));
                    }
                }
            }

            // eslint-disable-next-line max-len
            return neighbors.map((n) => Vec2.add(pos, n)).filter((n) => n.x >= 0 && n.y >= 0 && n.x < SIZE && n.y < SIZE);
        },
        (count) => count === 2 || count === 3,
        (count) => count === 3,
    );

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input.length; x++) {
            convay.set(new Vec2(x, y), input[y].charAt(x) === '#');
        }
    }

    print(convay);

    for (let i = 0; i < ROUNDS; i++) {
        convay.tick();
    }

    return convay.getActiveCount();
}

function print(convay: Convay<Vec2>): void {
    const board = create<boolean>(SIZE, SIZE, false);
    [...convay.getState().entries()].forEach(([, [pos, active]]) => {
        board[pos.y][pos.x] = active;
    });

    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {
            process.stdout.write(board[y][x] ? '#' : '.');
        }
        process.stdout.write('\n');
    }

    process.stdout.write('-----------\n');
}
