import { } from '@lib/input';
import { Context } from '@app/types';
import { sum } from '@lib/math/functions';

interface Rucksack {
    A: string[]
    B: string[]
}

const A = 65;
const a = 96;

export default function (input: string[], { logger }: Context) {
    const backpacks: Array<Rucksack> = input.map((line) => {
        return {
            A: line.substring(0, line.length/2).split(''),
            B: line.substring(line.length/2).split(''),
        };
    });

    const inters = backpacks.map((b) => {
        return [...new Set(intersection(b.A, b.B))]
    });


    return inters.reduce((prev, el) => {
        const values = el.map((item) => {
            let charCode = item.charCodeAt(0);

            if (charCode > a) {
                charCode = charCode - a;
            } else {
                charCode = charCode - A + 27;
            }

            return charCode
        })

        return prev + sum(...values)
    }, 0);

};

function intersection(a: string[], b: string[]): string[] {
    const union: string[] = [];

    if (a.length === 0 || b.length === 0) {
        return union;
    }

    for (const el of a) {
        if (b.includes(el)) {
            union.push(el)
        }
    }

    return union;
}
