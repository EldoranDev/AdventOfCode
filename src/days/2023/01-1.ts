import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    return input.reduce((acc, line) => acc + getNumber(line), 0);
}

function getNumber(line: string): number {
    const match = line.replace(/\D/g, '');

    if (!match) {
        throw new Error(`Could not find number in line: ${line}`);
    }

    return parseInt(`${match[0]}${match[match.length - 1]}`, 10);
}
