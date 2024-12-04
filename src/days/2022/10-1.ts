import {} from "@lib/input";
import { Context } from "@app/types";

const NOOP = "noop";

export default function (input: string[], { logger }: Context) {
    let X = 1;

    let BUFFER: number | null = null;

    let strength: number = 0;

    let OP = 0;

    const PTS = [20, 60, 100, 140, 180, 220];

    for (let i = 0; OP < input.length; i++) {
        if (PTS.includes(i + 1)) {
            console.log(X, i + 1);
            strength += X * (i + 1);
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
    }

    return strength;
}
