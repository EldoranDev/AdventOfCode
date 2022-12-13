/* eslint-disable no-param-reassign */
import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';
import { sum } from '@lib/math/functions';

type Entry = number | Array<number>;

export default function (input: string[], { logger }: Context) {
    const groups = getLineGroups(input);

    const ordered: Array<number> = [];

    for (let i = 0; i < groups.length; i++) {
        const [left, right] = groups[i].map((e) => JSON.parse(e));

        if (compare(left, right)) {
            ordered.push(i + 1);
        }
    }

    return sum(...ordered);
}

function compare(left: Entry, right: Entry): boolean | null {
    if (Number.isInteger(left) && Number.isInteger(right)) {
        if (left === right) {
            return null;
        }

        return left < right;
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
        return null;
    }

    return (left as Array<number>).length < (right as Array<Number>).length;
}
