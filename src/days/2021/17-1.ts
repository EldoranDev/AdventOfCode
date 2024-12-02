import { mapToNumber } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

const coords = /x=(\d*)..(\d*), y=([-\d]*)..([-\d]*)/;

export default function (input: string[], { logger }: Context) {
    const [ _, x1i, x2i, y1i, y2i ] = coords.exec(input[0]);

    const [ x1, x2, y1, y2 ] = mapToNumber([x1i, x2i, y1i, y2i]);

    const MAX_Y = 200;
    const MAX_X = 200;

    let highest = 0;

    for (let y = 1; y < MAX_Y; y++) {
        for (let x = 1; x < MAX_X; x++) {

            const pos = new Vec2(0, 0);
            const vel = new Vec2(x, y);
            let h = 0;

            while (pos.y > y1) {
                pos.add(vel);

                if (pos.y > h) {
                    h = pos.y;
                }

                vel.add(new Vec2(0, -1)); // Gravity
                
                if (vel.x !== 0) {
                    const drag = new Vec2(-1, 0);
                    drag.mult(Math.sign(vel.x));

                    vel.add(drag);
                }

                if (pos.x >= x1 && pos.x <= x2 && pos.y <= y2 && pos.y >= y1) {
                    console.log(`Hit with ${x}, ${y} max height: ${h}`);

                    if (h < highest) {
                        highest = h;
                        break;
                    }
                }
            }
        }   
    }

    return highest;
};