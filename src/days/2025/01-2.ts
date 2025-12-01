import {} from "@lib/input";
import { Context } from "@app/types";

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
    }

    return count;
}
