import {} from "@lib/input";
import { Context } from "@app/types";

const OP = {
    L: (a) => a + 99,
    R: (a) => a,
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
        let c = 0;

        if (rot.dir === "R") {
            for (let i = 0; i < rot.amount; i++) {
                dial++;
                dial %= LOCK_SIZE;

                if (dial === 0) {
                    c++;
                }
            }
        } else {
            for (let i = 0; i < rot.amount; i++) {
                dial--;

                if (dial < 0) {
                    dial += LOCK_SIZE;
                    dial %= LOCK_SIZE;
                }

                if (dial === 0) {
                    c++;
                }
            }
        }

        count += c;

        console.log(`Dial rotated ${rot.dir}${rot.amount} to point at ${dial} -- ${c}`);
    }

    return count;
}

function mod(a: number, b: number): number {
    a %= b;

    while (a < 0) {
        a += b;
        a %= b;
    }

    return a;
}
