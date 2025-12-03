import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const banks = input.map((l) => l.split(""));

    let sum = 0;

    for (const bank of banks) {
        sum += findHighest(bank);
    }

    return sum;
}

function findHighest(inp: string[]) {
    let highest = 0;

    for (let i = 0; i < inp.length; i++) {
        for (let j = i + 1; j < inp.length; j++) {
            const num = Number(inp[i] + inp[j]);

            if (num > highest) {
                highest = num;
            }
        }
    }

    return highest;
}
