import { } from '@lib/input';
import { Context } from '@app/types';
import { intersection, group } from '@lib/array';

interface Rucksack {
    A: string[]
    B: string[]
    ALL: string[]
}

const A = 65;
const a = 96;

export default function (input: string[], { logger }: Context) {
    const backpacks = input.map((line) => line.split(''));

    const groups = group<string[]>(backpacks, 3);
    const inters = groups.map((r) => intersection(...r)[0]);

    return inters.reduce((prev, el) => {
        let charCode = el.charCodeAt(0);

        if (charCode > a) {
            charCode -= a;
        } else {
            charCode = charCode - A + 27;
        }

        return charCode + prev;
    }, 0);
}
