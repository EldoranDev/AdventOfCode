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

    for(let line of input) {
        let match = extract.exec(line);
        
        const sides = [
            Number(match[1]),
            Number(match[2]),
            Number(match[3]),
        ];

        let valid = true;

        for(let c of combitnations) {
            logger.debug(`${sides[c[0]]} + ${sides[c[1]]} > ${sides[c[2]]}`);

            if (sides[c[0]] + sides[c[1]] <= sides[c[2]]) {
                valid = false;
                break;
            }
        }

        if (valid) {
            possible++;
        }
    }

    return possible;
};