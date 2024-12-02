import { } from '@lib/input';
import { Context } from '@app/types';

const EXTRACT = /(on|off) x=(\-?\d*)\.\.(\-?\d*),y=(\-?\d*)\.\.(\-?\d*),z=(\-?\d*)\.\.(\-?\d*)/;

export default function (input: string[], { logger }: Context) {
    const cubes = new Map<string, boolean>();
    
    for (const line of input) {
        const [_, state, x1, x2, y1, y2, z1, z2] = EXTRACT.exec(line);

        for (let x = Number(x1); x <= Number(x2); x++) {
            if (x > 50 || x < -50) continue;

            for (let y = Number(y1); y <= Number(y2); y++) {
                if (y > 50 || y < -50) continue;

                for (let z = Number(z1); z <= Number(z2); z++) {
                    if (z > 50 || z < -50) continue;

                    const id = `${x},${y},${z}`;

                    if (state === 'on') {
                        cubes.set(id, true);
                    } else {
                        if(cubes.has(id)) {
                            cubes.delete(id);
                        }
                    }
                }
            }
        }
    }

    return cubes.size;
};