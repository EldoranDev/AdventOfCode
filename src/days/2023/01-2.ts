import { } from '@lib/input';
import { Context } from '@app/types';

const mapping = new Map<string, string>([
    ['one', '1'],
    ['two', '2'],
    ['three', '3'],
    ['four', '4'],
    ['five', '5'],
    ['six', '6'],
    ['seven', '7'],
    ['eight', '8'],
    ['nine', '9'],
]);

export default function (input: string[], { logger }: Context) {
    return input.reduce((acc, line) => acc + getNumber(line), 0);
}

function getNumber(line: string): number {
    const prep = stringToDigit(line);
    const nums = prep.replace(/\D/g, '');

    if (!nums) {
        throw new Error(`Could not find number in line: ${line}`);
    }

    return parseInt(`${nums[0]}${nums[nums.length - 1]}`, 10);
}

function stringToDigit(line: string): string {
    let prep = line;

    const indices: Array<[string, number]> = [];

    [...mapping.keys()].forEach((key) => {
        let index = -1;
        do {
            index = prep.indexOf(key, index + 1);

            if (index !== -1) {
                indices.push([key, index]);
            }
        } while (index !== -1);
    });

    indices.sort(([, a], [, b]) => a - b);

    let last: [string, number] | undefined;

    for (const [key, index] of indices) {
        let rkey = key;

        if (last !== undefined) {
            if (last[1] + last[0].length >= index) {
                rkey = rkey.substring(last[1] + last[0].length - index);
            }
        }

        prep = prep.replace(rkey, mapping.get(key)!);
        last = [key, index];
    }

    return prep;
}
