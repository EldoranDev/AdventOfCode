import { getLineGroups, mapToNumber } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import { GeneralSet } from '@lib/collections';

export default function (input: string[], { logger }: Context) {
    let coords = new GeneralSet<Vec2>();

    const groups = getLineGroups(input);

    groups[0].forEach((line) => {
        const [x, y] = mapToNumber(line.split(','))
        coords.add(new Vec2(x, y));
    }, new GeneralSet<Vec2>());

    groups[1].forEach((instr) => {
        const [_, axis, index ] = /fold along ([xy])=([0-9]*)/.exec(instr);
        if (axis === 'x') {
            coords = new GeneralSet<Vec2>(
                [...coords.values()].map((v => new Vec2(
                    v.x < Number(index) ? v.x : 2 * Number(index) - v.x,
                    v.y
                )))
            );
        } else {
            coords = new GeneralSet<Vec2>(
                [...coords.values()].map((v => new Vec2(
                    v.x,
                    v.y < Number(index) ? v.y : 2 * Number(index) - v.y
                )))
            );
        }
    });
    
    const [X, Y] = [...coords.values()].reduce<[number, number]>(
        (val, current) => [ Math.max(val[0], current.x), Math.max(val[1], current.y)], [0, 0]
    );

    let output = '\n';

    for (let y = 0; y < Y+1; y++) {
        for (let x = 0; x < X+1; x++) {
            output += coords.has(new Vec2(x, y)) ? '#' : '.';
        }

        output += '\n';
    }

    logger.info(output);
};