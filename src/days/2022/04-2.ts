import { } from '@lib/input';
import { Context } from '@app/types';

interface Pair {
    A: Range
    B: Range
}

interface Range {
    from: number
    to: number
}

export default function (input: string[], { logger }: Context) {
    const pairs: Pair[] = input.map((line) => {
        const [A, B] = line.split(',');

        return {
            A: getRange(A),
            B: getRange(B),
        }
    });

    let included = 0;

    for (const pair of pairs) {
        if (overlap(pair.A, pair.B)) {
                included++
        }
    }

    return included;
};

function overlap(a: Range, b: Range): boolean {
    return (
        a.from <= b.to && b.from <= a.to
    )
}

function getRange(text: string): Range {
    const [from, to] = text.split('-');

    return {
        from: Number(from),
        to: Number(to),
    }
}
