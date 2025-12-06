import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const ranges = input[0].split(",").map((l) => {
        const [from, to] = l.split("-").map(Number);

        return {
            from,
            to,
        };
    });

    let sum = 0;

    for (const range of ranges) {
        for (let i = range.from; i <= range.to; i++) {
            const s = i.toString();

            if ((s + s).slice(1, -1).includes(s)) {
                sum += i;
            }
        }
    }

    return sum;
}
