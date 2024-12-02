import { mapToNumber } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const numbers = mapToNumber(input);

    let increase = 0;
    const last = [ numbers[0], numbers[1], numbers[2] ];

    for (let i = 1; i < numbers.length-2; i++) {
        if (last[0] + last[1] + last[2] < numbers[i] + numbers[i+1] + numbers[i+2]) {
            increase++;
        }

        last.shift();
        last.push(numbers[i+2]);
    }

    return increase;
};