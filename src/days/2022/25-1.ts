/* eslint-disable quote-props */

import { } from '@lib/input';
import { Context } from '@app/types';
import { sum } from '@lib/math/functions';

const N = { '2': 2, '1': 1, '0': 0, '-': -1, '=': -2 };
const D = { '-1': '-', '-2': '=' };

export default function (input: string[], { logger }: Context) {
    return DecToSnafu(sum(...input.map((line) => SnafuToDec(line))));
}

function SnafuToDec(num: string): number {
    let out = 0;

    for (let i = 0; i < num.length; i++) {
        out += (5 ** i) * N[num[num.length - i - 1]];
    }

    return out;
}

function DecToSnafu(num: number): string {
    const out = [];
    let left = num;

    while (left !== 0) {
        out.push((left % 5));
        left = Math.floor(left / 5);
    }

    // Add leading Zero to make next loop easier
    out.push(0);

    for (let i = 0; i < out.length; i++) {
        if (out[i] > 2) {
            out[i + 1]++;
            out[i] = D[out[i] - 5] ?? out[i - 5];
        }
    }

    out.reverse();

    if (out[0] === 0) {
        out.shift();
    }

    return out.join('');
}
