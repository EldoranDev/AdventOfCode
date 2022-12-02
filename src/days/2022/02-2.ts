import { } from '@lib/input';
import { Context } from '@app/types';

const WIN = { A: 'C', B: 'A', C: 'B' };
const LOSE = { A: 'B', B: 'C', C: 'A' };

export default function (input: string[], { logger }: Context) {
    let score = 0;

    for (const game of input) {
        // eslint-disable-next-line prefer-const
        const [E, R] = game.split(' ');

        let P = '';

        // eslint-disable-next-line default-case
        switch (R) {
            case 'X':
                P = WIN[E];
                break;
            case 'Y':
                P = E;
                break;
            case 'Z':
                P = LOSE[E];
                break;
        }

        score += P.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

        if (E === P) {
            score += 3;
            continue;
        }

        if (E === WIN[P]) {
            score += 6;
            continue;
        }
    }

    return score;
}
