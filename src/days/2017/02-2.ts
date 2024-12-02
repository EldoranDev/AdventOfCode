import { } from '@lib/input';

export default function (input: string[]) {
    let checksum = 0;

    for (const line of input) {
        checksum += getMinMax(line);
    }

    return checksum;
};

function getMinMax(row: string): number {
    const numbers = row.split('	').map(n => Number(n)).sort((a, b) => b - a);

    for (let i = 0; i < numbers.length; i++) {
        for (let j = i+1; j < numbers.length; j++) {
            if (numbers[i] % numbers[j] === 0) {
                return numbers[i] / numbers[j];
            }
        }
    }
}
