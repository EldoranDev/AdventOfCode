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
        if (pair.A.from <= pair.B.from && pair.A.to >= pair.B.to
            || pair.B.from <= pair.A.from && pair.B.to >= pair.A.to) {
                included++
        }
    }

    return included;
};

function getRange(text: string): Range {
    const [from, to] = text.split('-');

    return {
        from: Number(from),
        to: Number(to),
    }
}
