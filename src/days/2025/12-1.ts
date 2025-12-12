import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { sum } from "@lib/math/functions";

interface Area {
    size: Vec2;
    elements: number[];
}

const EXTRACTOR = /(?<x>\d+)x(?<y>\d+):(?<count>.*)/;

export default function (input: string[], { logger }: Context) {
    const areas: Array<Area> = getLineGroups(input)
        .slice(-1)[0]
        .map((line) => {
            const res = EXTRACTOR.exec(line);

            return {
                size: new Vec2(Number(res.groups.x), Number(res.groups.y)),
                elements: res.groups.count.trim().split(" ").map(Number),
            };
        });

    return areas.filter((a) => {
        const size = a.size.x * a.size.y;
        const presents = sum(...a.elements);

        return size >= presents * 9;
    }).length;
}
