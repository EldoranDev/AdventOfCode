import {} from "@lib/input";
import { Context } from "@app/types";
import { sum } from "@lib/math/functions";

type NumberRef = { number: number };

const RESULT_NUMS = [1000, 2000, 3000];

export default function (input: string[], { logger }: Context) {
    const elements: Array<NumberRef> = input.map((line) => ({
        number: +line,
    }));

    const mixer = [...elements];

    for (const num of elements) {
        const index = mixer.indexOf(num);
        mixer.splice(index, 1);
        const newIndex = (index + num.number) % mixer.length;
        mixer.splice(newIndex, 0, num);
    }

    const pos = mixer.findIndex((n) => n.number === 0);

    return sum(...RESULT_NUMS.map((n) => mixer[(pos + n) % mixer.length].number));
}
