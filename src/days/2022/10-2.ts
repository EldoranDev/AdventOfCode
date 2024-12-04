import {} from "@lib/input";
import { Context } from "@app/types";
import { create } from "@lib/array2d";

const NOOP = "noop";

export default function (input: string[], { logger }: Context) {
    let X = 1;
    let CRT_POS = 0;

    let BUFFER: number | null = null;

    let OP = 0;

    const CRT = create(40, 6, ".");

    for (let i = 0; OP < input.length; i++) {
        if (CRT_POS % 40 >= X - 1 && CRT_POS % 40 <= X + 1) {
            CRT[(CRT_POS / 40) | 0][CRT_POS % 40] = "#";
        }

        if (BUFFER !== null) {
            X += BUFFER;
            BUFFER = null;
            OP++;
        } else if (input[OP] === NOOP) {
            OP++;
        } else {
            const [, amount] = input[OP].split(" ");
            BUFFER = Number(amount);
        }

        CRT_POS++;
    }

    return CRT.reduce((prev, line) => `${prev}\n${line.join("")}`, "");
}
