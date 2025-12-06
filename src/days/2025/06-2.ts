import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { flipHorizontal, rotateClockwise } from "@lib/array2d";

const OP = {
    "*": (a: number, b: number) => a * b,
    "+": (a: number, b: number) => a + b,
};

export default function (input: string[], { logger }: Context) {
    const problems = getLineGroups(
        flipHorizontal(rotateClockwise(input.map((l) => l.split("")))).map((l) => l.join("")),
    );

    let sum = 0;

    for (const problem of problems) {
        const op = problem[0][problem[0].length - 1];

        let current = Number(problem[0].substring(0, problem[0].length - 1));

        for (let i = 1; i < problem.length; i++) {
            current = OP[op](current, Number(problem[i]));
        }

        sum += current;
    }

    return sum;
}
