import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';
import { equals } from '@lib/array';
import { getColumn } from '@lib/array2d';

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

        for (let yy = 0; y - yy - 1 >= 0 && y + yy < pattern.length; yy++) {
            const top = pattern[y - yy - 1].join('');
            const bottom = pattern[y + yy].join('');

            if (top !== bottom) {
                mirrored = false;
                break;
            }
        }

        if (mirrored) {
            return {
                y,
                direction: 'horizontal',
            };
        }
    }

    for (let x = 1; x < pattern[0].length; x++) {
        let mirrored = true;

        for (let xx = 0; x - xx - 1 >= 0 && x + xx < pattern[0].length; xx++) {
            const left = getColumn(pattern, x - xx - 1).join();
            const right = getColumn(pattern, x + xx).join();

            if (left !== right) {
                mirrored = false;
                break;
            }
        }

        if (mirrored) {
            return {
                x,
                direction: 'vertical',
            };
        }
    }

    throw new Error('No reflection found');
}
