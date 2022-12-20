import { } from '@lib/input';
import { Context } from '@app/types';
import { sum } from '@lib/math/functions';

type NumberRef = { number: number };

export default function (input: string[], { logger }: Context) {
    const elements: Array<NumberRef> = input.map((line) => ({
        number: (+line) * 811589153,
    }));

    const mixer = [...elements];

    for (let i = 0; i < 10; i++) {
        for (const num of elements) {
            const index = mixer.indexOf(num);
            mixer.splice(index, 1);
            const newIndex = (index + num.number) % mixer.length;
            mixer.splice(newIndex, 0, num);
        }
    }

    const pos = mixer.findIndex((n) => n.number === 0);

    const result = [
        mixer[(pos + 1000) % mixer.length],
        mixer[(pos + 2000) % mixer.length],
        mixer[(pos + 3000) % mixer.length],
    ].map((n) => n.number);

    return sum(...result);
}
