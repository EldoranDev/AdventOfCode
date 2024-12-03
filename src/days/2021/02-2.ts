import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2, Vec3 } from '@lib/math';

export default function (input: string[], { logger }: Context) {
    let pos = new Vec3(0, 0, 0);

    for (let line of input) {
        let [ instr, length ] = line.split(' ');

        switch(instr) {
            case 'forward':
                pos.x += Number(length);
                pos.y += pos.z * Number(length);
                break;
            case 'down':
                pos.z += Number(length);
                break;
            case 'up':
                pos.z -= Number(length);
                break;
        }
    }

    return pos.x * pos.y;
};
