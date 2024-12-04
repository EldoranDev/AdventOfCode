import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

const RGX = /move (\d+) from (\d) to (\d)/;

export default function (input: string[], { logger }: Context) {
    const stackCount = `${input[0]} `.length / 4;

    const stacks: string[][] = [];

    for (let i = 0; i < stackCount; i++) {
        stacks[i] = [];
    }

    const [start, moves] = getLineGroups(input);

    for (let i = 0; i < start.length - 1; i++) {
        for (let j = 0; j < stackCount; j++) {
            let val = start[i].substring(j * 4, j * 4 + 4);

            val = val.replace("[", "").replace("]", "").trim();

            if (val !== "") {
                stacks[j].unshift(val);
            }
        }
    }

    moves.forEach((move) => {
        const [, count, from, to] = RGX.exec(move);

        const elements = [];

        for (let i = 0; i < Number(count); i++) {
            elements.unshift(stacks[Number(from) - 1].pop());
        }

        for (let i = 0; i < Number(count); i++) {
            stacks[Number(to) - 1].push(elements[i]);
        }
    });

    return stacks.reduce((msg, stack) => msg + stack[stack.length - 1], "");
}
