/* eslint-disable no-param-reassign */
import { } from '@lib/input';
import { Context } from '@app/types';

const layers: Array<[number, number]> = [];

export default function (input: string[], { logger }: Context) {
    for (const line of input) {
        const [layer, depth] = line.split(':').map((p) => Number(p.trim()));

        layers.push([layer, (depth * 2) - 2]);
    }

    for (let i = 0; ; i++) {
        if (check(i)) {
            return i;
        }
    }
}

function check(delay: number): boolean {
    for (const layer of layers) {
        if ((layer[0] + delay) % layer[1] === 0) {
            return false;
        }
    }

    return true;
}

/*
function checkNaive(layers: number, delay: number, depths, dirs, pos): boolean {
    for (let i = -delay; i <= layers; i++) {
        if (pos[i] !== undefined && pos[i] === 0) {
            return false;
        }

        for (const layer of Object.keys(pos)) {
            pos[layer] += dirs[layer];

            if (pos[layer] === 0 || pos[layer] === (depths[layer] - 1)) {
                dirs[layer] *= -1;
            }
        }
    }

    return true;
}
*/
