import { } from '@lib/input';
import { Vec2 } from '@lib/math';

export default function (input: string[]) {
    const instr = input[0]
        .split('')
        .map(c => {
            switch (c) {
                case '^':
                    return Vec2.UP;
                case '>':
                    return Vec2.RIGHT;
                case 'v':
                    return Vec2.DOWN;
                case '<':
                    return Vec2.LEFT;
            }
        });

    const position: Vec2 = new Vec2();
    const houses: Set<string> = new Set([]);

    houses.add(`${position.x}-${position.y}`);

    for (let i = 0; i < instr.length; i++) {
        position.add(instr[i]);

        houses.add(`${position.x}-${position.y}`);
    }
    return houses.size;
};