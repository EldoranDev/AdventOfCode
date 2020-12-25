import { } from '@lib/input';

export default function (input: string[]) {

    let cardKey = Number(input[0]);
    let doorKey = Number(input[1]);


    let cardLoop = findLoopsize(7, cardKey);
    // let doorLoop = findLoopsize(11, doorKey);

    let val = 1;
    let sub = doorKey;

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