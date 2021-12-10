import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const CHUNK_START = ['[', '{', '<', '('];

    const PAIR = {
        '[': ']',
        '{': '}',
        '<': '>',
        '(': ')',
    };

    const SCORES = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4,
    };

    let line_scores = [];

    for (let line of input) {
        let stack = [];

        let chars = line.split('');
        let valid = true;

        for (let char of chars) {
            if (CHUNK_START.includes(char)) {
                stack.push(PAIR[char]);
            } else {
                if (stack[stack.length-1] !== char) {
                    valid = false;
                    break;
                } else {
                    stack.pop();
                }
            }
        }

        if (!valid) {
            continue;
        }
        
        let score = 0;

        logger.debug(`Completed by: ${stack.reverse().join('')}`)

        for (let c of stack.reverse()) {
            score *= 5;
            score += SCORES[c];
        }

        line_scores.push(score);

        logger.debug(`Score: ${score}`);
    }

    line_scores.sort((a, b) => a - b);


    return line_scores[(line_scores.length/2)|0];
};