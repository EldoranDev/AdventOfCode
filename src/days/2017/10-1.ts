import {} from "@lib/input";
import { Context } from "@app/types";
import { range } from "@lib/math/functions";

export default function (input: string[], { logger, test }: Context) {
    const lengths = input[0].split(",").map((n) => Number(n));

    const list = test ? range(5, 0) : range(256, 0);

    let position = 0;
    let skipSize = 0;

    for (let i = 0; i < lengths.length; i++) {
        const slice = getSlice(list, position, lengths[i]);

        slice.reverse();

        for (let j = 0; j < lengths[i]; j++) {
            list[(j + position) % list.length] = slice[j];
        }

        position += lengths[i] + skipSize;
        skipSize++;
    }

    return list[0] * list[1];
}

function getSlice(array: number[], from: number, length: number): number[] {
    const slice = [];

    for (let i = 0; i < length; i++) {
        slice.push(array[(i + from) % array.length]);
    }

    return slice;
}
