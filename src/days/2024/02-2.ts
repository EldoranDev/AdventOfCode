import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const reports = input.map((line) => line.split(' ').map((v) => Number(v)));

    const unsafe = reports.filter((report) => !isSafe(report) && !canBeMadeSafe(report));

    return input.length - unsafe.length;
}

// Not the cleanest solution
// Could be made way more efficient by
// Checking which is the offending level and trying to remove that
function canBeMadeSafe(report: number[]): boolean {
    for (let i = 0; i < report.length; i++) {
        const copy = [...report];
        copy.splice(i, 1);

        if (isSafe(copy)) {
            return true;
        }
    }

    return false;
}

function isSafe(levels: number[]): boolean {
    const sign = Math.sign(levels[1] - levels[0]);

    for (let i = 0; i < levels.length - 1; i++) {
        const diff = levels[i + 1] - levels[i];

        if (sign !== Math.sign(diff)) {
            return false;
        }

        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
            return false;
        }
    }

    return true;
}
