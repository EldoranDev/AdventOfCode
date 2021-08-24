import { } from '@lib/input';

const RULE1 = /(..).*\1/;
const RULE2 = /(.).\1/;

export default function (input: string[]) {
    return input.filter(s => isNice(s)).length;
};

function isNice(check: string): boolean {
    if (!RULE1.test(check)) {
        return false;
    }

    if (!RULE2.test(check)) {
        return false;
    }
    
    return true;
}