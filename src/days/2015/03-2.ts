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

    const santa: Vec2 = new Vec2();
    const bot: Vec2 = new Vec2();

    const houses: Set<string> = new Set([]);

    houses.add(`${santa.x}-${santa.y}`);

    for (let i = 0; i < instr.length; i++) {
        if (i % 2 === 0) {
            santa.add(instr[i]);
        } else {
            bot.add(instr[i]);
        }

        houses.add(`${santa.x}-${santa.y}`);
        houses.add(`${bot.x}-${bot.y}`);
    }
    return houses.size;
};