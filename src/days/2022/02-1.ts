import { } from '@lib/input';

const MAP = { X: 'A', Y: 'B', Z: 'C' };
const WIN = { A: 'C', B: 'A', C: 'B' };

export default function (input: string[]) {
    let score = 0;

    for (const game of input) {
        // eslint-disable-next-line prefer-const
        let [E, P] = game.split(' ');

        P = MAP[P];

        score += P.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

        if (E === P) {
            score += 3;
            continue;
        }

        if (E === WIN[P]) {
            score += 6;
        }
    }

    return score;
}
