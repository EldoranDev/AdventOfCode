import { } from '@lib/input';
import { Context } from '@app/types';

import '@lib/array/extensions';

export default function (input: string[], { logger }: Context) {
    return input
        .map((line) => line.split(' ').map(Number))
        .map(extrapolate)
        .reduce((acc, current) => acc + current[current.length - 1], 0);
}

function extrapolate(sequence: number[]): number[] {
    const sequences = [sequence];

    // Reduce until zero row is reached
    do {
        const currentSequence = sequences[0];
        const nextSequence = [];

        for (let i = 0; i < currentSequence.length - 1; i++) {
            nextSequence.push(currentSequence[i + 1] - currentSequence[i]);
        }

        sequences.unshift(nextSequence);
    } while (!sequences.first().every((val) => val === 0));

    sequences.first().push(0);

    // Extrapolate
    for (let i = 0; i < sequences.length - 1; i++) {
        const current = sequences[i];
        const next = sequences[i + 1];

        next.push(next.last() + current.last());
    }

    return sequence;
}
