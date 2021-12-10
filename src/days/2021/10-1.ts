import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const CHUNK_START = ['[', '{', '<', '('];
    const CHUNK_END = [']', '}', '>', ')'];

    const PAIR = {
        '[': ']',
        '{': '}',
        '<': '>',
        '(': ')',
    };

    const SCORES = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
    };

    let score = 0;

    for (let line of input) {
        let stack = [];

        let chars = line.split('');
        let valid = true;

        for (let char of chars) {
            if (CHUNK_START.includes(char)) {
                stack.push(PAIR[char]);
            } else {
                if (stack[stack.length-1] !== char) {
                    logger.debug(`Excpected ${stack[stack.length-1]} found ${char}`)
                    score += SCORES[char];
                    valid = false;
                    break;
                } else {
                    stack.pop();
                }
            }
        }
    }

    return score;
};