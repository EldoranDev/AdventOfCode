import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    let line = input[0];

    for (let i = 0; i < 50; i++) {
        line = transform(line);
    }

    return line.length;
}

type Entry = { num: string, count: number };

function transform(value: string): string {
    const groups: Array<Entry> = [];

    groups.push({ num: value[0], count: 0 });

    for (const char of value.split('')) {
        if (groups[groups.length - 1].num === char) {
            groups[groups.length - 1].count++;
        } else {
            groups.push({ num: char, count: 1 });
        }
    }

    let ouput: string = '';

    for (const group of groups) {
        ouput += `${group.count}${group.num}`;
    }

    return ouput;
}
