import {} from "@lib/input";
import { Context } from "@app/types";

const TARGET = 34000000;
const PRESENTS = 10;

export default function (input: string[], { logger }: Context) {
    for (let i = 1; ; i++) {
        const ds = getDivisorSum(i) * PRESENTS;

        if (ds >= TARGET) {
            return i;
        }
    }
}

function getDivisorSum(n: number): number {
    var sum = 0;

    for (let i = 0; i <= Math.sqrt(n); i++) {
        if (n % i != 0) {
            continue;
        }

        sum += i;

        if (n / i == i) {
            continue;
        }

        sum += n / i;
    }

    return sum;
}
