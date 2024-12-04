import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const SEARCH = /mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)/g;

    let sum = 0;

    for (let i = 0; i < input.length; i++) {
        const mults = input[i].matchAll(SEARCH);

        sum += mults.reduce<number>(
            (val, match) => val + Number(match.groups.a) * Number(match.groups.b),
            0,
        );
    }

    return sum;
}
