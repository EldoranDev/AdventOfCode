import { mapToNumber } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    let numbers = mapToNumber(input);

    let increase = 0;
    let last = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > last) {
            increase++;
        }

        last = numbers[i];
    }

    return increase;
};