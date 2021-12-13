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

    groups[1].slice(0, 1).forEach((instr) => {
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
    
    return coords.size;
};