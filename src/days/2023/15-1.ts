import {} from "@lib/input";
import { Context } from "@app/types";
import { sum } from "@lib/math/functions";

export default function (input: string[], { logger }: Context) {
    return sum(...input[0].split(",").map(hash));
}

function hash(input: string): number {
    let val = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        val += char;
        val *= 17;
        val %= 256;
    }

    return val;
}
