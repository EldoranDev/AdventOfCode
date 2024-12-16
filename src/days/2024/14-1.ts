import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

interface Robot {
    pos: Vec2;
    vel: Vec2;
}

const SIM_COUNT = 100;

const EXTRACTOR = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/;

export default function (input: string[], { logger, test }: Context) {
    const SIZE = test ? new Vec2(11, 7) : new Vec2(101, 103);

    const robots: Robot[] = input.map((line) => {
        const [, px, py, vx, vy] = EXTRACTOR.exec(line);

        return {
            pos: new Vec2(Number(px), Number(py)),
            vel: new Vec2(Number(vx), Number(vy)),
        };
    });

    const quad = {
        tl: 0,
        tr: 0,
        bl: 0,
        br: 0,
    };

    for (const robot of robots) {
        robot.pos.x = (((robot.pos.x + robot.vel.x * SIM_COUNT) % SIZE.x) + SIZE.x) % SIZE.x;
        robot.pos.y = (((robot.pos.y + robot.vel.y * SIM_COUNT) % SIZE.y) + SIZE.y) % SIZE.y;
    }

    const x = (SIZE.x / 2) | 0;
    const y = (SIZE.y / 2) | 0;

    for (const robot of robots) {
        if (robot.pos.x < x && robot.pos.y < y) {
            quad.tl++;
        } else if (robot.pos.x < x && robot.pos.y > y) {
            quad.tr++;
        } else if (robot.pos.x > x && robot.pos.y < y) {
            quad.bl++;
        } else if (robot.pos.x > x && robot.pos.y > y) {
            quad.br++;
        }
    }

    return quad.tl * quad.tr * quad.bl * quad.br;
}
