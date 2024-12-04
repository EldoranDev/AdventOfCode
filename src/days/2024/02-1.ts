import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    let count = 0;

    for (const line of input) {
        const levels = line.split(" ").map((v) => Number(v));
        const sign = Math.sign(levels[1] - levels[0]);

        let save = true;

        for (let i = 0; i < levels.length - 1; i++) {
            const diff = levels[i + 1] - levels[i];

            if (sign !== Math.sign(diff)) {
                save = false;
                break;
            }

            if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
                save = false;
                break;
            }
        }

        if (save) {
            count++;
        }
    }

    return count;
}
