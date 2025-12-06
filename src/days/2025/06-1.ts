import {} from "@lib/input";
import { Context } from "@app/types";
import { rotateClockwise } from "@lib/array2d";

const OP = {
    "*": (a: number, b: number) => a * b,
    "+": (a: number, b: number) => a + b,
};

export default function (input: string[], { logger }: Context) {
    const problems = rotateClockwise(input.map((l) => l.trim().split(/\s+/)));

    let sum = 0;

    for (const problem of problems) {
        let curr = Number(problem[1]);

        for (let i = 2; i < problem.length; i++) {
            curr = OP[problem[0]](curr, Number(problem[i]));
        }

        sum += curr;
    }

    return sum;
}
