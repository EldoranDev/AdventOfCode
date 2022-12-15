import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

const E = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

interface Sensor {
    pos: Vec2;
    beacon: Vec2;
}

const COUNT_ROW = 2_000_000;

export default function (input: string[], { logger }: Context) {
    const BEACONS: Set<string> = new Set<string>();

    const sensors: Array<Sensor> = input.map((line) => {
        const [, px, py, bx, by] = E.exec(line);

        BEACONS.add(new Vec2(Number(bx), Number(by)).toString());

        return {
            pos: new Vec2(Number(px), Number(py)),
            beacon: new Vec2(Number(bx), Number(by)),
        };
    });

    const blocked = new Set<number>();

    for (const sensor of sensors) {
        const distance = sensor.pos.manhattan(sensor.beacon);

        for (let y = -distance + 1; y < distance; y++) {
            if (sensor.pos.y + y !== COUNT_ROW) {
                continue;
            }

            for (let x = -distance + 1; x < distance; x++) {
                if (Math.abs(y) + Math.abs(x) > distance) {
                    continue;
                }

                if (!BEACONS.has(new Vec2(sensor.pos.x + x, sensor.pos.y + y).toString())) {
                    blocked.add(sensor.pos.x + x);
                }
            }
        }
    }

    return blocked.size;
}
