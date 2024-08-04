import { range } from '@lib/math/functions';
import { Hash } from './hash';

const SUFFIX = [17, 31, 73, 47, 23];
const ROUNDS = 64;

export function knot(input: string): Hash {
    const lengths = input.split('').map((n) => Number(n.charCodeAt(0)));

    lengths.push(...SUFFIX);

    const list = range(256, 0);

    let position = 0;
    let skipSize = 0;

    for (let r = 0; r < ROUNDS; r++) {
        for (let i = 0; i < lengths.length; i++) {
            const slice = getSlice(list, position, lengths[i]);

            slice.reverse();

            for (let j = 0; j < lengths[i]; j++) {
                list[(j + position) % list.length] = slice[j];
            }

            position += lengths[i] + skipSize;
            skipSize++;
        }
    }

    const bytes: number[] = [];

    for (let i = 0; i < 16; i++) {
        const slice = getSlice(list, i * 16, 16);

        bytes.push(
            slice.reduce((prev, curr) => prev ^ curr, 0),
        );
    }

    return new Hash(bytes);
}

function getSlice(array: number[], from: number, length: number): number[] {
    const slice = [];

    for (let i = 0; i < length; i++) {
        slice.push(array[(i + from) % array.length]);
    }

    return slice;
}
