import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { variance } from "@lib/math/functions/variance";

interface Robot {
    pos: Vec2;
    cur: Vec2;
    vel: Vec2;
}

const INFINITY = 10_000;

const EXTRACTOR = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/;

export default function (input: string[], { logger, test }: Context) {
    const SIZE = test ? new Vec2(11, 7) : new Vec2(101, 103);

    const robots: Robot[] = input.map((line) => {
        const [, px, py, vx, vy] = EXTRACTOR.exec(line);

        return {
            pos: new Vec2(Number(px), Number(py)),
            cur: new Vec2(Number(px), Number(py)),
            vel: new Vec2(Number(vx), Number(vy)),
        };
    });

    let lowIdx = 0;

    let low = Number.MAX_SAFE_INTEGER;
    let image = "";

    for (let i = 0; i < INFINITY; i++) {
        for (const robot of robots) {
            robot.cur.x = (((robot.pos.x + robot.vel.x * i) % SIZE.x) + SIZE.x) % SIZE.x;
            robot.cur.y = (((robot.pos.y + robot.vel.y * i) % SIZE.y) + SIZE.y) % SIZE.y;
        }

        const vy = variance(...robots.map((robo) => robo.cur.y));
        const vx = variance(...robots.map((robo) => robo.cur.x));

        if (vy + vx < low) {
            low = vy + vx;
            lowIdx = i;
        }
    }

    for (const robot of robots) {
        robot.cur.x = (((robot.pos.x + robot.vel.x * lowIdx) % SIZE.x) + SIZE.x) % SIZE.x;
        robot.cur.y = (((robot.pos.y + robot.vel.y * lowIdx) % SIZE.y) + SIZE.y) % SIZE.y;
    }

    for (let y = 0; y < SIZE.y; y++) {
        for (let x = 0; x < SIZE.x; x++) {
            if (robots.findIndex((rob) => rob.cur.x === x && rob.cur.y === y) !== -1) {
                image += "#";
            } else {
                image += ".";
            }
        }

        image += "\n";
    }

    console.log(image);

    return lowIdx;
}
