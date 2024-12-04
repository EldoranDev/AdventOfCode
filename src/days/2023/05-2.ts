import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

interface Range {
    from: number;
    to: number;

    length: number;
}

type Group = Array<Range>;

export default function (input: string[], { logger }: Context) {
    const groups = getLineGroups(input);

    const seedRanges = groups.shift()[0].split(":")[1].trim().split(" ").map(Number);

    function* getSeed() {
        for (let i = 0; i < seedRanges.length; i += 2) {
            const from = seedRanges[i];
            const to = seedRanges[i] + seedRanges[i + 1];

            for (let j = from; j < to; j++) {
                yield j;
            }

            console.log("Finished seed group");
        }
    }

    const maps = groups.map((group): Group => {
        const ranges: Range[] = [];
        group.shift();

        group.forEach((line) => {
            const [to, from, length] = line.split(" ").map(Number);

            ranges.push({
                from,
                to,
                length,
            });
        });

        return ranges;
    });

    let lowest = Number.MAX_SAFE_INTEGER;

    for (let seed of getSeed()) {
        for (const map of maps) {
            for (let j = 0; j < map.length; j++) {
                if (seed >= map[j].from && seed < map[j].from + map[j].length) {
                    seed = map[j].to + (seed - map[j].from);
                    break;
                }
            }
        }

        if (seed < lowest) {
            lowest = seed;
        }
    }

    return lowest;
}
