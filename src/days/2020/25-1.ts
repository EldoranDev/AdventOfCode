import { } from '@lib/input';

export default function (input: string[]) {

    const cardKey = Number(input[0]);
    const doorKey = Number(input[1]);

    const cardLoop = findLoopsize(7, cardKey);

    let val = 1;
    const sub = doorKey;

    for (let i = 0; i < cardLoop; i++) {
        val *= sub;
        val  %= 20201227;
    }

    return val;
};

function findLoopsize(sub: number, pub: number): number {
    let val = 1;
    let count = 0;

    while (val !== pub)  {
        val *= sub;
        val %= 20201227;

        count++;
    }

    return count;
}