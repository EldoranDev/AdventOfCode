import { mapToNumber } from '@lib/input';

export default function (input: string[]) {
    return mapToNumber(input).reduce((sum, val) => sum + getNeededFuel(val), 0);
};

function getNeededFuel(number: number): number {
    let val = ((number/3)|0) - 2;

    if (val <= 0) {
        return 0;
    }

    return val + getNeededFuel(val);
}