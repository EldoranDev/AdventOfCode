import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const [rangeInput, idInput] = getLineGroups(input);

    const ranges = rangeInput.map((l) => {
        const [f, t] = l.split("-");

        return {
            from: Number(f),
            to: Number(t),
        };
    });

    const ids = idInput.map(Number);

    let count = 0;

    for (const id of ids) {
        for (const r of ranges) {
            if (r.from <= id && r.to >= id) {
                count++;
                break;
            }
        }
    }

    return count;
}
