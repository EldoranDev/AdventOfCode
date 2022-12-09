import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

export default function (input: string[], { logger }: Context) {
    const ROPE_LENGTH = 10;
    const R: Vec2[] = [];

    for (let i = 0; i < ROPE_LENGTH; i++) {
        R[i] = new Vec2(0, 0);
    }

    const visisted: Set<string> = new Set<string>();

    const directions = {
        R: Vec2.RIGHT,
        U: Vec2.UP,
        L: Vec2.LEFT,
        D: Vec2.DOWN,
    };

    input.forEach((instr) => {
        const [dir, length] = instr.split(' ');

        for (let i = 0; i < Number(length); i++) {
            R[0].add(directions[dir]);

            for (let r = 1; r < ROPE_LENGTH; r++) {
                const diff = Vec2.sub(R[r - 1], R[r]);

                if (Math.abs(diff.x) > 1 && diff.y === 0) {
                    diff.setLength(1);
                    R[r].add(diff);
                }

                if (Math.abs(diff.y) > 1 && diff.x === 0) {
                    diff.setLength(1);
                    R[r].add(diff);
                }

                if (diff.lengthSquared > 2) {
                    diff.x = diff.x > 0 ? 1 : -1;
                    diff.y = diff.y > 0 ? 1 : -1;

                    R[r].add(diff);
                }
            }
            visisted.add(R[R.length - 1].toString());
        }
    });

    return visisted.size;
}
