import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

export default function (input: string[], context: Context) {
    const pos = new Vec2(0, 0);
    const direction = new Vec2(0, 1);

    for(const instr of input[0].split(',').map(i => i.trim())) {
        switch (instr.substr(0, 1)) {
            case 'L':
                direction.rotate(90, 'deg');
                break;
            case 'R':
                direction.rotate(-90, 'deg');
                break;
        }
        context.logger.debug(instr);
        context.logger.debug(direction);
        context.logger.debug(pos);
        pos.add(Vec2.mult(direction, Number(instr.substr(1, instr.length-1))));
    }

    context.logger.debug(pos);

    return pos.manhattan(new Vec2(0, 0));
};