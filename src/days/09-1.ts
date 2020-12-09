import { mapToNumber } from '../lib/input';

export default function (input: string[]) {
    const numbers = mapToNumber(input);

    const PREAMBLE_LENGTH = 25;

    const valid = [];

    for (let i = 0; i < PREAMBLE_LENGTH; i++) {
        valid.push(numbers[i]);
    }

    for (let i =  PREAMBLE_LENGTH; i < numbers.length; i++) {
        if (!canSum(valid, numbers[i])) {
            return numbers[i];
        };

        valid.shift();

        valid.push(numbers[i]);
    }

    return "";
};

function canSum (numbers: number[], sum: number): boolean {
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > sum) continue;
        for (let j= 0; j < numbers.length; j++) {
            if (i === j) continue;
            
            if (numbers[i] + numbers[j] === sum) {
                return true;
            }
        }
    }

    return false;
}
