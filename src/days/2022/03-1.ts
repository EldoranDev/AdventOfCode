import {} from "@lib/input";
import { Context } from "@app/types";
import { sum } from "@lib/math/functions";
import { intersection } from "@lib/array";

interface Rucksack {
    A: string[];
    B: string[];
}

const A = 65;
const a = 96;

export default function (input: string[], { logger }: Context) {
    const backpacks: Array<Rucksack> = input.map((line) => ({
        A: line.substring(0, line.length / 2).split(""),
        B: line.substring(line.length / 2).split(""),
    }));

    const inters = backpacks.map((b) => [...new Set(intersection(b.A, b.B))]);

    return inters.reduce((prev, el) => {
        const values = el.map((item) => {
            let charCode = item.charCodeAt(0);

            if (charCode > a) {
                charCode -= a;
            } else {
                charCode = charCode - A + 27;
            }

            return charCode;
        });

        return prev + sum(...values);
    }, 0);
}
