import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import { implementation as logger } from '@app/logger';

const keypad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];

const moves = {
    'U': new Vec2(0, -1),
    'L': new Vec2(-1, 0),
    'R': new Vec2(1, 0),
    'D': new Vec2(0, 1),
}

export default function (input: string[], context: Context) {
    const numbers = [];
    let position = new Vec2(1, 1);

    for(const line of input) {
        position = followPath(line, position);
        logger.debug('---');

        numbers.push(
            keypad[position.y][position.x]
        );
    }

    return numbers.join('');
};

function followPath(line: string, position: Vec2): Vec2 {

    for (const move of line.split('')) {
        position.add(moves[move]);
        position.x = Math.min(Math.max(0, position.x), 2);
        position.y = Math.min(Math.max(0, position.y), 2);
        
        logger.debug(position);
    }

    return position;
}