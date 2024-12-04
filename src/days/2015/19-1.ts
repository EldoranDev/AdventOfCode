import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

type Replacement = {
    from: string;
    to: string;
};

export default function (input: string[], { logger }: Context) {
    const [instructions, [moluecule]] = getLineGroups(input);

    const replacements: Array<Replacement> = [];

    for (const instruction of instructions) {
        const [from, to] = instruction.split(" => ");

        replacements.push({ from, to });
    }

    const result = new Set<string>();

    for (const { from, to } of replacements) {
        let index = 0;

        while (index !== -1) {
            index = moluecule.indexOf(from, index);

            if (index !== -1) {
                result.add(moluecule.slice(0, index) + to + moluecule.slice(index + from.length));
                index += from.length;
            }
        }
    }

    return result.size;
}
