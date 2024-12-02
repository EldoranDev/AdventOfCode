import { } from '@lib/input';
import { Context } from '@app/types';

const combitnations = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 2, 0]
];

const extract = /\s*(\d+)\s*(\d+)\s*(\d+)/;

export default function (input: string[], { logger }: Context) {
    let possible = 0;

    const sides: number[] = [];

    for(let i = 0; i < input.length; i++) {
        const match = extract.exec(input[i]);
        
        sides[i] = Number(match[1]);
        sides[i + input.length] = Number(match[2]);
        sides[i + (2* input.length)] = Number(match[3]);
    }

    for (let i = 0; i < input.length; i++) {
        let valid = true;

        for(const comb of combitnations) {
            const a = sides[i*3 + comb[0]];
            const b = sides[i*3 + comb[1]];
            const c = sides[i*3 + comb[2]];
            logger.debug(`${a} + ${b} (${a+b}) > ${c} (${a + b > c})`);

            if (a + b <= c) {
                valid = false;
                break;
            }
        }

        if (valid) {
            logger.debug('possible');
            possible++;
        }

        logger.debug('---');
    }

    return possible;
};