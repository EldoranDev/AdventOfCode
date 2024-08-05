import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const stepSize = Number(input[0]);

    let position = 0;
    let val = null;

    for (let i = 1; i <= 50000000; i++) {
        position = (position + stepSize) % i;

        if (position === 0) {
            val = i;
        }

        position++;
    }

    return val;
}
