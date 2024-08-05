import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const stepSize = Number(input[0]);

    const buffer = [0];
    let position = 0;

    for (let i = 0; i < 2017; i++) {
        position = (position + stepSize) % buffer.length;

        buffer.splice(position + 1, 0, (i + 1));
        position++;
    }

    return buffer[position + 1];
}
