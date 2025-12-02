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
            if (repeats(i)) {
                sum += i;
            }
        }
    }

    return sum;
}

function repeats(num: number): boolean {
    const str = num.toString();

    for (let l = 1; l <= Math.floor(str.length / 2); l++) {
        const s = str.substring(0, l);
        let match = true;
        let i = l;
        for (; i <= str.length - l; i += l) {
            if (str.substring(i, i + l) !== s) {
                match = false;
                break;
            }
        }

        if (match && i === str.length) {
            return true;
        }
    }

    return false;
}
