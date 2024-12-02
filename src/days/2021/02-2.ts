import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec3 } from '@lib/math';

export default function (input: string[], { logger }: Context) {
    const pos = new Vec3(0, 0, 0);

    for (const line of input) {
        const [ instr, length ] = line.split(' ');

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
}
