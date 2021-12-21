import { } from '@lib/input';
import { Context } from '@app/types';
import { memoize } from '@lib/functools';

const WINNING_SCORE = 21;

const role = memoize(function (player: number, scores: [ number, number ], positions: [ number, number ]) {

    if (scores[((player + 1) % 2)] >= WINNING_SCORE) {
        let s = [0, 0];
        s[(player + 1) % 2] = 1;

        return s;
    }

    let wins: [number, number] = [0, 0];

    for (let r1 = 0; r1 < 3; r1++) {
        for (let r2 = 0; r2 < 3; r2++) {
            for (let r3 = 0 ; r3 < 3; r3++) {
                let rolled = r1 + r2 + r3 + 3;
                let pos: [number, number] = [...positions];
                let sco: [number, number] = [...scores];

                pos[player] = (pos[player] + rolled) % 10;
                sco[player] += pos[player] + 1;

                const [ A, B] = role(
                    (player + 1) % 2,
                    sco,
                    pos
                );

                wins[0] += A;
                wins[1] += B;
            }
        }
    }

    return wins;
});

export default function (input: string[], { logger }: Context) {
    const [
        [_, in1 ],
        [__, in2 ],
    ] = input.map(l => l.split(':'));
    
    const POS: [ number, number ] = [
        Number(in1.trim())-1,
        Number(in2.trim())-1,
    ];

    const SCORES: [ number, number ] = [0,0];

    return Math.max(
        ...role(0, SCORES, POS)
    );
};


