import {} from "@lib/input";
import { Context } from "@app/types";

const TARGET = 34000000;
const LIMIT = 50;
const PRESENTS = 11;

export default function (input: string[], { logger }: Context) {
    for (let i = 1; ; i++) {
        const ds = getDivisorSum(i, LIMIT) * PRESENTS;

        if (ds >= TARGET) {
            return i;
        }
    }
}

function getDivisorSum(n: number, limit: number): number {
    let sum = 0;

    let itter = 1;

    for (let i = 0; i <= Math.sqrt(n); i++) {
        if (itter >= limit) {
            break;
        }

        if (n % i != 0) {
            continue;
        }

        sum += i;
        itter++;

        if (n / i == i) {
            continue;
        }

        sum += n / i;
        itter++;
    }

    return sum;
}
