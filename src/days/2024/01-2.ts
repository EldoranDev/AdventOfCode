import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const listA: number[] = [];
    const listB: number[] = [];

    for (let i = 0; i < input.length; i++) {
        const [a, b] = input[i].split('   ');

        listA.push(Number(a));
        listB.push(Number(b));
    }

    const counts = getCounts(listB);
    let score = 0;

    for (let i = 0; i < listA.length; i++) {
        score += listA[i] * (counts.get(listA[i]) ?? 0);
    }

    return score;
}

function getCounts(arr: number[]): Map<number, number> {
    const map = new Map<number, number>();

    for (let i = 0; i < arr.length; i++) {
        const current = map.get(arr[i]) ?? 0;

        map.set(arr[i], current + 1);
    }

    return map;
}
