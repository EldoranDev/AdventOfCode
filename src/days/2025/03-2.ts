import {} from "@lib/input";
import { Context } from "@app/types";

const NUM_BATERIES = 12;

export default function (input: string[], { logger }: Context) {
    const banks = input.map((l) => l.split("").map((n) => Number(n)));

    let sum = 0;

    for (const bank of banks) {
        sum += findHighest(bank, "");
    }

    return sum;
}

function findHighest(inp: number[], num: string): number {
    if (num.length === NUM_BATERIES) {
        return Number(num);
    }

    const highest = [0, 0];

    for (let i = 0; i <= inp.length - (NUM_BATERIES - num.length); i++) {
        if (highest[0] < inp[i]) {
            highest[0] = inp[i];
            highest[1] = i;
        }
    }

    return findHighest(inp.slice(highest[1] + 1), `${num}${highest[0]}`);
}
