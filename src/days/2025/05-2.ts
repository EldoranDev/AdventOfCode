import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const ranges = getLineGroups(input)[0].map((l) => {
        const [f, t] = l.split("-");

        return {
            from: Number(f),
            to: Number(t),
        };
    });

    ranges.sort((a, b) => a.from - b.from);

    let count = 0;

    for (let i = 0; i < ranges.length; i++) {
        while (ranges[i + 1] !== undefined && ranges[i].to >= ranges[i + 1].from) {
            ranges[i].to = Math.max(ranges[i].to, ranges[i + 1].to);

            ranges.splice(i + 1, 1);
        }

        count += ranges[i].to - ranges[i].from + 1;
    }

    return count;
}
