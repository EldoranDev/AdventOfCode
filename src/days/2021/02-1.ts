import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2, Vec3 } from '@lib/math';

export default function (input: string[], { logger }: Context) {
    const pos = new Vec2(0, 0);
    
    for (const line of input) {
        const [ instr, length ] = line.split(' ');
        
        switch(instr) {
            case 'forward':
                pos.x += Number(length);
                break;
            case 'down':
                pos.y += Number(length);
                break;
            case 'up':
                pos.y -= Number(length);
                break;
        }
    }

    return pos.x * pos.y;
};