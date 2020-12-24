import { } from '@lib/input';
import { Vec3 } from '@lib/math';
import { Convay } from '@lib/simulation';

const ROUNDS = 6;

export default function (input: string[]) {   
    const neighbors = [];

    for (let z = -1; z <= 1; z++) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                if (!(z === y && y === x && x === 0)) {
                    neighbors.push(new Vec3(x, y, z));
                }
            }
        }
    }

    let convay = new Convay<Vec3>(
        (pos) => neighbors.map(n => Vec3.add(pos, n)),
        (count) => count === 2 || count === 3,
        (count) => count === 3
    );

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input.length; x++) {
            convay.set(new Vec3(x, y, 0), input[y].charAt(x) === '#');
        }
    }
    
    for (let round = 0; round < ROUNDS; round++) {
        convay.tick();
    }

    return convay.getActiveCount();
};
