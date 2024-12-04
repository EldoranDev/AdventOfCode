import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

const E = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

interface Sensor {
    pos: Vec2;
    beacon: Vec2;
    distance: number;
}

const MIN = 0;
const MAX = 4000000;

export default function (input: string[], { logger }: Context) {
    const sensors: Array<Sensor> = input.map((line) => {
        const [, px, py, bx, by] = E.exec(line);

        const pos = new Vec2(Number(px), Number(py));
        const beacon = new Vec2(Number(bx), Number(by));

        return {
            pos,
            beacon,
            distance: pos.manhattan(beacon),
        };
    });

    for (let y = MIN; y < MAX; y++) {
        const free = getFree(y, sensors);

        if (free !== null) {
            return free * 4000000 + y;
        }
    }

    return null;
}

type Range = [number, number];

function getFree(row: number, sensors: Array<Sensor>): number | null {
    const sens = sensors.filter((s) => s.pos.y - s.distance <= row && s.pos.y + s.distance >= row);
    // Precompute diff in y

    for (let x = MIN; x < MAX; x++) {
        const pos = new Vec2(x, row);

        const index =
            sens
                .map((s, i) => ({ d: pos.manhattan(s.pos), i }))
                .filter((s) => s.d <= sens[s.i].distance)
                .sort((a, b) => b.d - a.d)[0]?.i ?? null;

        if (index === null) {
            return x;
        }

        const sen = sens[index];
        const diffY = Math.abs(sen.pos.y - row);
        const range = sen.distance - diffY;

        x = sen.pos.x + range;
    }

    return null;
}
