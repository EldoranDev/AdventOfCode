import { } from '@lib/input';

export default function (input: string[]) {
    let length = 0;

    for (let line of input) {
        var a = '';

        eval(`a = ${line}`);

        length += line.length - a.length;
    }
    return length;
};