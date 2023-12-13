import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';
import { getColumn } from '@lib/array2d';
import { hammingDistance } from '@lib/strings';

interface Reflection {
    x?: number;
    y?: number;

    direction: 'horizontal' | 'vertical';
}

export default function (input: string[], { logger }: Context) {
    return getLineGroups(input)
        .map((pattern) => pattern.map((line) => line.split('')))
        .map(findReflection)
        .reduce((acc, reflection) => acc + (reflection.direction === 'horizontal' ? reflection.y * 100 : reflection.x), 0);
}

function findReflection(pattern: string[][]): Reflection {
    for (let y = 1; y < pattern.length; y++) {
        let mirrored = true;
        let nudged = false;

        for (let yy = 0; y - yy - 1 >= 0 && y + yy < pattern.length; yy++) {
            const top = pattern[y - yy - 1].join('');
            const bottom = pattern[y + yy].join('');

            const h = hammingDistance(top, bottom);

            if (h > 1 || (h > 0 && nudged)) {
                mirrored = false;
                break;
            }

            if (h > 0) {
                nudged = true;
            }
        }

        if (mirrored && nudged) {
            return {
                y,
                direction: 'horizontal',
            };
        }
    }

    for (let x = 1; x < pattern[0].length; x++) {
        let mirrored = true;
        let nudged = false;

        for (let xx = 0; x - xx - 1 >= 0 && x + xx < pattern[0].length; xx++) {
            const left = getColumn(pattern, x - xx - 1).join();
            const right = getColumn(pattern, x + xx).join();

            const h = hammingDistance(left, right);

            if (h > 1 || (h > 0 && nudged)) {
                mirrored = false;
                break;
            }

            if (h > 0) {
                nudged = true;
            }
        }

        if (mirrored && nudged) {
            return {
                x,
                direction: 'vertical',
            };
        }
    }

    throw new Error('No reflection found');
}
