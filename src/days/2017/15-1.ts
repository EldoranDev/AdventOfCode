import { } from '@lib/input';
import { Context } from '@app/types';

import '@lib/array/extensions/index';

export default function (input: string[], { logger }: Context) {
    const gens = [
        new Generator(Number(input[0].split(' ').last()), 16807),
        new Generator(Number(input[1].split(' ').last()), 48271),
    ];

    let match = 0;

    for (let i = 0; i < 40_000_000; i++) {
        const a = (gens[0].next() & 0xFFFF);
        const b = (gens[1].next() & 0xFFFF);

        if (a === b) {
            match++;
        }
    }

    return match;
}

class Generator {
    private number: number;

    constructor(
        seed: number,
        private factor: number,
    ) {
        this.number = seed;
    }

    public next(): number {
        this.number = (this.number * this.factor) % 2147483647;

        return this.number;
    }
}
