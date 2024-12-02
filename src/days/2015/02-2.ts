import { } from '@lib/input';

export default function (input: string[]) {
    let sum = 0;

    for (let i = 0; i < input.length; i++) {
        const sides = input[i]
            .split('x')
            .map(d => Number(d))
            .sort((a, b) => a-b);

        sum += sides[0] * 2 + sides[1] * 2;
        sum += sides[0] * sides[1] * sides[2];
    }

    return sum;
};