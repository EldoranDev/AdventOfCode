import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

const E = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

interface Sensor {
    pos: Vec2;
    beacon: Vec2;
    distance: number;
}

const COUNT_ROW = 2000000;

let MIN = 0;
let MAX = 20;

export default function (input: string[], { logger }: Context) {
    const BEACONS: Set<string> = new Set<string>();

    const sensors: Array<Sensor> = input.map((line) => {
        const [, px, py, bx, by] = E.exec(line);

        const pos = new Vec2(Number(px), Number(py));
        const beacon = new Vec2(Number(bx), Number(by));

        MIN = Math.min(pos.x, beacon.x, MIN);
        MAX = Math.max(pos.x, beacon.x, MAX);

        BEACONS.add(beacon.toString());

        return {
            pos,
            beacon,
            distance: pos.manhattan(beacon),
        };
    });

    const blocked = getBlocked(COUNT_ROW, sensors);

    console.log(MIN, MAX);

    return blocked.reduce((prev, current) => prev + (current[1] - current[0]), 0);
}

type Range = [number, number];

function getBlocked(row: number, sensors: Array<Sensor>): Array<Range> {
    const sens = sensors.filter((s) => s.pos.y - s.distance <= row && s.pos.y + s.distance >= row);
    // Precompute diff in y

    let ranges: Array<Range> = [];

    for (let x = MIN; x < MAX; x++) {
        const pos = new Vec2(x, row);

        const index =
            sens
                .map((s, i) => ({ d: pos.manhattan(s.pos), i }))
                .filter((s) => s.d <= sens[s.i].distance)
                .sort((a, b) => b.d - a.d)[0]?.i ?? null;

        if (index === null) {
            continue;
        }

        const sen = sens[index];
        const diffY = Math.abs(sen.pos.y - row);
        const range = sen.distance - diffY;
        ranges.push([sen.pos.x - range, sen.pos.x + range]);

        x = sen.pos.x + range;
    }

    let hadMerge = true;

    while (hadMerge && ranges.length > 1) {
        console.log(ranges);
        hadMerge = false;

        const blocked: Array<Range> = [];

        for (let i = 0; i < ranges.length - 1; i++) {
            if (ranges[i][1] >= ranges[i + 1][0]) {
                blocked.push([ranges[i][0], ranges[i + 1][1]]);
                i++;
                hadMerge = true;
            } else {
                blocked.push([...ranges[i]]);
            }
        }

        ranges = blocked;
    }

    return ranges;
}
