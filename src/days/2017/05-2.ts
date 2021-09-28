import { mapToNumber } from '@lib/input';

export default function (input: string[]) {
    const instructions = mapToNumber(input);

    let pos = 0;
    let count = 0;

    while (pos >= 0 && pos <= input.length) {
        const instr = instructions[pos];

        if (instr >= 3) {
            instructions[pos]--;
        } else {
            instructions[pos]++;
        }
        pos += instr;

        count++;
    }

    return count-1;
};
