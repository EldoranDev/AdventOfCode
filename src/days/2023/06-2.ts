import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const time = Number(input[0]
        .split(':')[1]
        .trim()
        .split(' ')
        .filter((x) => x !== '')
        .map(Number)
        .join(''));

    const distance = Number(input[1]
        .split(':')[1]
        .trim()
        .split(' ')
        .filter((x) => x !== '')
        .map(Number)
        .join(''));

    let winner = 0;

    for (let i = 0; i < time; i++) {
        if (i * (time - i) > distance) {
            winner++;
        }
    }

    return winner;
}
