import { } from '@lib/input';

export default function (input: string[]) {
    const parsed = JSON.parse(input.join('\r\n'));

    return getSum(parsed);
}

function getSum(objects: Object|any[], sum: number = 0): number {
    if (!Array.isArray(objects)) {
        objects = Object.values(objects);
    }

    for (let element of objects as any[]) {
        if (Number.isInteger(element)) {
            sum += element;
        }

        if (typeof element === 'string') {
            continue;
        }

        sum += getSum(element);
    }

    return sum;
}
