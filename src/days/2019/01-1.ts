import { mapToNumber } from '@lib/input';

export default function (input: string[]) {
    return mapToNumber(input).reduce((sum, val) => sum + ((val/3) | 0) - 2, 0);
};