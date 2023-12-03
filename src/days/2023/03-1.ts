import { } from '@lib/input';
import { Context } from '@app/types';

const SYMBOL = /(\d|\.)/;
const NUM = /(\d)/;

const nums = new Map<string, string>();
const symbols = new Map<string, string>();

export default function (input: string[], { logger }: Context) {
    for (let y = 0; y < input.length; y++) {
        let num = '';
        for (let x = 0; x < input[y].length; x++) {
            if (NUM.test(input[y][x])) {
                num += input[y][x];
            } else if (num !== '') {
                nums.set(`${x - num.length},${y}`, num);
                num = '';
            }

            const isSymbol = !SYMBOL.test(input[y][x]);

            if (isSymbol) {
                symbols.set(`${x},${y}`, input[y][x]);
            }
        }

        if (num !== '') {
            nums.set(`${input[y].length - num.length},${y}`, num);
            num = '';
        }
    }

    return Array.from(nums.entries()).filter(([key, value]) => {
        const [x, y] = key.split(',').map((v) => parseInt(v, 10));

        return hasSymbol(x, y, value.length);
    }).reduce((acc, [, value]) => acc + parseInt(value, 10), 0);
}

function hasSymbol(x: number, y: number, length: number): boolean {
    const candidates = [
        [x - 1, y],
        [x + length, y],
    ];

    for (let xx = x - 1; xx < x + length + 1; xx++) {
        candidates.push([xx, y - 1]);
        candidates.push([xx, y + 1]);
    }

    for (const [xx, yy] of candidates) {
        if (symbols.has(`${xx},${yy}`)) {
            return true;
        }
    }

    return false;
}
