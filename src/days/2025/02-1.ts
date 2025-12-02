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
            const num = i.toString();

            const n1 = num.substring(0, Math.floor(num.length / 2));
            const n2 = num.substring(Math.floor(num.length / 2));

            if (n1.length === n2.length && n1 === n2) {
                sum += i;
            }
        }
    }

    return sum;
}
