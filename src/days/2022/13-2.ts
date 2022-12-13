/* eslint-disable no-param-reassign */
import { Context } from '@app/types';

type Entry = number | Array<number>;

const DIVIDER_A = '[[2]]';
const DIVIDER_B = '[[6]]';

export default function (input: string[], { logger }: Context) {
    input.unshift(DIVIDER_A, DIVIDER_B);

    const list = input
        .filter((l) => l !== '')
        .map((line) => JSON.parse(line))
        .sort((a, b) => compare(a, b))
        .map((e) => JSON.stringify(e));

    return (list.indexOf(DIVIDER_A) + 1) * (list.indexOf(DIVIDER_B) + 1);
}

function compare(left: Entry, right: Entry): number {
    if (Number.isInteger(left) && Number.isInteger(right)) {
        if (left === right) {
            return 0;
        }

        return (left as number) - (right as number);
    }

    if (Number.isInteger(left)) {
        left = [left] as Entry;
    }

    if (Number.isInteger(right)) {
        right = [right] as Entry;
    }
    const ll = (left as Array<number>).length;
    const rl = (right as Array<number>).length;

    const loop = Math.min(ll, rl);

    for (let i = 0; i < loop; i++) {
        const result = compare(left[i], right[i]);

        if (result === null) {
            continue;
        }

        return result;
    }

    if (ll === rl) {
        return 0;
    }

    return (left as Array<number>).length - (right as Array<Number>).length;
}
