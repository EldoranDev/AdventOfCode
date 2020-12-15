import { } from '../lib/input';

export default function (input: string[]) {
    let startingNumbers = input[0].split(',');

    let history: Record<string, number[]> = {};

    for (let i = 0; i < startingNumbers.length; i++) {
        history[startingNumbers[i]] = [i];
        console.log(startingNumbers[i]);
    }

    let lastNumber = startingNumbers[startingNumbers.length-1];

    for (let i = startingNumbers.length; i < 30000000; i++) {
        
        let num = history[lastNumber];

        if (num.length === 1) {
            history['0'].push(i);
            lastNumber = '0';
        } else {
            lastNumber = (num[num.length-1] - num[num.length-2]).toString();

            if (history[lastNumber] === undefined) {
                history[lastNumber] = [i];
            } else {
                history[lastNumber].push(i);

                if (history[lastNumber].length > 2) {
                    history[lastNumber].shift();
                }
            }
        }

        if (i % 10000 === 0) {
            console.log(i, 30000000 - i);
        }
    }

    return lastNumber;
};