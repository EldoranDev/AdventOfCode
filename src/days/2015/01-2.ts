import { } from '@lib/input';

export default function (input: string[]) {
    let current = 0;
    const instr = input[0].split('');

    for (let i = 0; i < instr.length; i++) {
        if (instr[i] === ')') {
            current--
        } else {
            current++;
        }

        if (current === -1) {
            return i + 1;
        }
    }
};