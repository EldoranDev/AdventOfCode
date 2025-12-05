import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const [rangeInput] = getLineGroups(input);

    const ranges = rangeInput.map((l) => {
        const [f, t] = l.split("-");

        return {
            from: Number(f),
            to: Number(t),
        };
    });

    ranges.sort((a, b) => a.from - b.from);

    let modified = false;

    do {
        modified = false;

        for (let i = 0; i < ranges.length - 1; i++) {
            if (ranges[i].to >= ranges[i + 1].from) {
                ranges[i].to = Math.max(ranges[i].to, ranges[i + 1].to);

                ranges.splice(i + 1, 1);
                modified = true;
            }
        }
    } while (modified);

    let count = 0;

    for (const r of ranges) {
        count += r.to - r.from + 1;
    }

    return count;
}
