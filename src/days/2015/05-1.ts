import { } from '@lib/input';

export default function (input: string[]) {
    return input.filter(s => isNice(s)).length;
};

function isNice(check: string): boolean {

    const badCombinations = ['ab', 'cd', 'pq', 'xy'];

    if(badCombinations.reduce((b, c) => b || check.includes(c), false)) {
        return false;
    }
    
    let double = '';
    let count = 0;
    let last = '';

    for (let i = 0; i < check.length; i++) {
        let c = check.charAt(i);

        if (c === last) {
            double = c;

        }

        if (['a', 'e', 'i', 'o', 'u'].includes(c)) {
            count++;
        }

        last = c;
    }

    if (double !== '' && count >= 3) {
        return true;
    }
    
    return false;
}