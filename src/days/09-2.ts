import { mapToNumber } from '../lib/input';

const PREAMBLE_LENGTH = 25;

export default function (input: string[]) {
    const numbers = mapToNumber(input);

    const number = findFirstInvalid(numbers);

    console.log(number);

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > number) continue;

        let sum = numbers[i];
        
        let lowest = numbers[i];
        let highest = numbers[i];

        for (let j = i+1; j < numbers.length; j++) {
            if (sum > number) break;

            if (numbers[j] < lowest) {
                lowest = numbers[j];
            }

            if (numbers[j] > highest) {
                highest = numbers[j];
            }

            sum += numbers[j];

            if (sum === number) {
                console.log(lowest, highest);
                return lowest + highest;
            }
        }
    }
    
    return number;
};

function findFirstInvalid(numbers: number[]): number {
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

    throw new Error("Could not find anything");

}

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
