import {} from "@lib/input";
import { Context } from "@app/types";

const OP = {
    L: (a, b) => a - b,
    R: (a, b) => a + b,
};

const LOCK_SIZE = 100;

export default function (input: string[], { logger }: Context) {
    const rotations = input.map((l) => ({
        dir: l.substring(0, 1),
        amount: Number(l.substring(1)),
    }));

    let dial = 50;
    let count = 0;

    for (const rot of rotations) {
        dial = OP[rot.dir](dial, rot.amount);

        dial %= LOCK_SIZE;

        while (dial < 0) {
            dial += LOCK_SIZE;
            dial %= LOCK_SIZE;
        }

        if (dial === 0) {
            count++;
        }
    }

    return count;
}
