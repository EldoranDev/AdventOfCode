import { } from '@lib/input';

export default function (input: string[]) {
    return input[0].split('').reduce((sum, c) => {
        if (c === ')') {
            return --sum;
        }

        return ++sum;
    }, 0)
};