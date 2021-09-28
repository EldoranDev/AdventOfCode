import { mapToNumber } from '@lib/input';

export default function (input: string[]) {
    const instructions = mapToNumber(input);

    let pos = 0;
    let count = 0;

    while (pos >= 0 && pos <= input.length) {
        pos += instructions[pos]++;
        count++;
    }

    return count - 1;
};
