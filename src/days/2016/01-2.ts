import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

export default function (input: string[], context: Context) {
    const pos = new Vec2(0, 0);
    const direction = new Vec2(0, 1);
    const history = new Set();

    for(let instr of input[0].split(',').map(i => i.trim())) {
        switch (instr.substr(0, 1)) {
            case 'L':
                direction.rotate(90, 'deg');
                break;
            case 'R':
                direction.rotate(-90, 'deg');
                break;
        }

        let distance = Number(instr.substr(1, instr.length-1));

        for (; distance > 0; distance--) {
            pos.add(direction);

            if (history.has(pos.toString())) {
                return pos.manhattan(new Vec2(0, 0));
            }
    
            history.add(pos.toString());
        }

     
    }
};