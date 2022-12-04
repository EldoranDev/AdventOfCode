import { } from '@lib/input';
import { Context } from '@app/types';
import { sum } from '@lib/math/functions';

interface Rucksack {
    A: string[]
    B: string[]
    ALL: string[]
}

const A = 65;
const a = 96;

export default function (input: string[], { logger }: Context) {
    const backpacks: Array<Rucksack> = input.map((line) => {
        return {
            A: line.substring(0, line.length/2).split(''),
            B: line.substring(line.length/2).split(''),
            ALL: line.split(''),
        };
    });

    let inters = [];

    for (let i = 0; i < backpacks.length; i += 3) {
        var id = intersection(intersection(backpacks[i].ALL, backpacks[i + 1].ALL), backpacks[i+2].ALL)[0]
        inters.push(id)
    }

    return inters.reduce((prev, el) => {
            let charCode = el.charCodeAt(0);

            if (charCode > a) {
                charCode = charCode - a;
            } else {
                charCode = charCode - A + 27;
            }

            return charCode + prev
    }, 0);

};

function intersection(a: string[], b: string[]): string[] {
    const inter: string[] = [];

    if (a.length === 0 || b.length === 0) {
        return inter;
    }

    for (const el of a) {
        if (b.includes(el)) {
            inter.push(el)
        }
    }

    return inter;
}

