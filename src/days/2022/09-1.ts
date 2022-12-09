import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

export default function (input: string[], { logger }: Context) {
    const H: Vec2 = new Vec2(0, 0);
    const T: Vec2 = new Vec2(0, 0);

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
            H.add(directions[dir]);

            const diff = Vec2.sub(H, T);

            if (Math.abs(diff.x) > 1 && diff.y === 0) {
                diff.setLength(1);
                T.add(diff);
            }

            if (Math.abs(diff.y) > 1 && diff.x === 0) {
                diff.setLength(1);
                T.add(diff);
            }

            if (diff.lengthSquared > 2) {
                diff.x = diff.x > 0 ? 1 : -1;
                diff.y = diff.y > 0 ? 1 : -1;

                T.add(diff);
            }

            visisted.add(T.toString());
        }
    });

    return visisted.size;
}
