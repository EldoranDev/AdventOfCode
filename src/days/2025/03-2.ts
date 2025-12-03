import {} from "@lib/input";
import { Context } from "@app/types";

const NUM_BATERIES = 12;

export default function (input: string[], { logger }: Context) {
    const banks = input.map((l) => l.split("").map((n) => Number(n)));

    let sum = 0;

    for (const bank of banks) {
        sum += findHighest(bank, "", NUM_BATERIES, NUM_BATERIES);
    }

    return sum;
}

function findHighest(inp: number[], num: string, left: number, length: number): number {
    if (left === 0) {
        return Number(num);
    }

    let highest = 0;
    let highestIdx = 0;

    for (let i = 0; i <= inp.length - left; i++) {
        if (highest < inp[i]) {
            highest = inp[i];
            highestIdx = i;
        }
    }

    return findHighest(inp.slice(highestIdx + 1), `${num}${highest}`, left - 1, length);
}
