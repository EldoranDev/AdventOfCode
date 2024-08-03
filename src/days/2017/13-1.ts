import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const pos = {};
    const depths = {};
    const dirs = {};

    let last = 0;

    for (const line of input) {
        const [layer, depth] = line.split(':').map((p) => Number(p.trim()));

        pos[layer] = 0;
        depths[layer] = depth;
        dirs[layer] = 1;

        last = layer;
    }

    let severity = 0;

    for (let i = 0; i <= last; i++) {
        if (pos[i] !== undefined && pos[i] === 0) {
            severity += (depths[i] * i);
        }

        for (const layer of Object.keys(pos)) {
            pos[layer] += dirs[layer];

            if (pos[layer] === 0 || pos[layer] === (depths[layer] - 1)) {
                dirs[layer] *= -1;
            }
        }
    }

    return severity;
}
