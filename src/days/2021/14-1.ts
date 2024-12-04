import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

const ROUNDS = 10;

export default function (input: string[], { logger }: Context) {
    const instr = new Map<string, string>();

    const [START, INSTR] = getLineGroups(input);

    let output = START[0];

    INSTR.forEach((line) => {
        const [A, B] = line.split("->").map((l) => l.trim());

        instr.set(A, B);
    });

    for (let r = 0; r < ROUNDS; r++) {
        let tmp = "";

        for (let i = 0; i < output.length - 1; i++) {
            const char = output[i] + output[i + 1];

            tmp += output[i];

            if (instr.has(char)) {
                tmp += instr.get(char);
            }
        }

        output = tmp + output[output.length - 1];
    }
    console.log(output);

    // Count;
    const count = new Map<string, number>();

    for (const c of output.split("")) {
        if (!count.has(c)) {
            count.set(c, 0);
        }

        count.set(c, count.get(c) + 1);
    }

    const countValues = [...count.values()];

    countValues.sort((a, b) => a - b);
    console.log(countValues);

    return countValues[countValues.length - 1] - countValues[0];
}
