/* eslint-disable no-labels */
import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';

interface Reflection {
    x?: number;
    y?: number;

    direction: 'horizontal' | 'vertical';
}

interface Pattern {
    rows: number[];
    columns: number[];
}

export default function (input: string[], { logger }: Context) {
    return getLineGroups(input)
        .map(getPattern)
        .map(findReflection)
        .reduce((acc, reflection) => acc + (reflection.direction === 'horizontal' ? reflection.y * 100 : reflection.x), 0);
}

function getPattern(lines: string[]): Pattern {
    const pattern: Pattern = {
        rows: Array.from({ length: lines.length }, () => 0),
        columns: Array.from({ length: lines[0].length }, () => 0),
    };

    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const value = lines[y][x] === '#' ? 1 : 0;

            pattern.rows[y] <<= 1;
            pattern.rows[y] |= value;

            pattern.columns[x] <<= 1;
            pattern.columns[x] |= value;
        }
    }

    return pattern;
}

function findReflection(pattern: Pattern): Reflection {
    outer:
    for (let i = 1; i < pattern.rows.length; i++) {
        for (let ii = 0; i - ii - 1 >= 0 && i + ii < pattern.rows.length; ii++) {
            if (pattern.rows[i - ii - 1] !== pattern.rows[i + ii]) {
                continue outer;
            }
        }

        return {
            y: i,
            direction: 'horizontal',
        };
    }

    outer:
    for (let i = 1; i < pattern.columns.length; i++) {
        for (let ii = 0; i - ii - 1 >= 0 && i + ii < pattern.columns.length; ii++) {
            if (pattern.columns[i - ii - 1] !== pattern.columns[i + ii]) {
                continue outer;
            }
        }

        return {
            x: i,
            direction: 'vertical',
        };
    }

    throw new Error('No reflection found');
}
