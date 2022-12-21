import { } from '@lib/input';
import { Context } from '@app/types';

interface Operation {
    a: string;
    b: string;
    op: string;
}

const E = /([a-z]{4})\s([+\-*/])\s([a-z]{4})/;

const OPS = {
    '*': (a, b) => a * b,
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '/': (a, b) => a / b,
};

export default function (input: string[], { logger }: Context) {
    const map = new Map<string, Operation | number>();

    for (const line of input) {
        const [monkey, term] = line.split(':');

        const match = E.exec(term);

        if (match) {
            const [, a, op, b] = match;
            map.set(monkey, {
                a,
                b,
                op,
            });
        } else {
            map.set(monkey, +term.trim());
        }
    }

    let replaced = true;

    while (replaced) {
        replaced = false;

        for (const [key, value] of map.entries()) {
            if (Number.isInteger(value)) {
                continue;
            }

            const a = map.get((value as Operation).a);
            const b = map.get((value as Operation).b);

            if (!Number.isInteger(a) || !Number.isInteger(b)) {
                continue;
            }

            map.set(key, OPS[(value as Operation).op](a, b));
            replaced = true;
        }
    }

    console.log(map);

    return map.get('root');
}
