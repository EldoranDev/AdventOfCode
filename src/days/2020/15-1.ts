import { } from '@lib/input';

export default function (input: string[]) {
    let startingNumbers = input[0].split(',').map(n => Number(n));
    const COUNT = 2020;

    let history: number[] = new Array(COUNT);

    for (let i = 0; i < startingNumbers.length; i++) {
        history[startingNumbers[i]] = i;
    }

    let lastNumber = startingNumbers[startingNumbers.length-1];
    let newNumber = 0;

    for (let i = startingNumbers.length; i < COUNT; i++) {
        if (history[lastNumber] === undefined) {
            history[lastNumber] = i-1;

            lastNumber = 0;
        } else {
            newNumber = i - history[lastNumber] - 1;
            history[lastNumber] = i-1;
            lastNumber = newNumber;
        }
    }

    return lastNumber;
};
