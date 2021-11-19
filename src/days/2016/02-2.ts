import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import { implementation as logger } from '@app/logger';

const keypad = [
    [ null, null,   1,      null,   null ],
    [ null, 2,      3,      4,      null ],
    [ 5,    6,      7,      8,      9    ],
    [ null, 'A',    'B',    'C',    null ],
    [ null, null,   'D',    null,   null ],

];

const moves = {
    'U': new Vec2(0, -1),
    'L': new Vec2(-1, 0),
    'R': new Vec2(1, 0),
    'D': new Vec2(0, 1),
}

export default function (input: string[], context: Context) {
    const numbers = [];
    let position = new Vec2(0, 2);

    for(let line of input) {
        position = followPath(line, position);
        logger.debug('---');

        numbers.push(
            keypad[position.y][position.x]
        );
    }

    return numbers.join('');
};

function followPath(line: string, position: Vec2): Vec2 {

    for (let move of line.split('')) {
        let next = Vec2.add(position, moves[move]);

        next.x = Math.min(Math.max(0, next.x), 4);
        next.y = Math.min(Math.max(0, next.y), 4);

        if (keypad[next.y][next.x] !== null) {
            position.x = next.x;
            position.y = next.y;
        }
        
        logger.debug(position);
    }

    return position;
}