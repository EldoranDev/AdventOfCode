/* eslint-disable @typescript-eslint/no-loop-func */
import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

type Elf = Vec2;
type Suggestion = { pos: Vec2; from: Array<Vec2> };
type Check = { move: Vec2; conditon: Array<Vec2> };

const DIR = {
    N: new Vec2(0, -1),
    E: new Vec2(1, 0),
    S: new Vec2(0, 1),
    W: new Vec2(-1, 0),

    NE: new Vec2(1, -1),
    NW: new Vec2(-1, -1),
    SE: new Vec2(1, 1),
    SW: new Vec2(-1, 1),
};

const ALL_DIRS = Object.values(DIR);

const CHECKS: Array<Check> = [
    { move: DIR.N, conditon: [DIR.N, DIR.NE, DIR.NW] },
    { move: DIR.S, conditon: [DIR.S, DIR.SE, DIR.SW] },
    { move: DIR.W, conditon: [DIR.W, DIR.NW, DIR.SW] },
    { move: DIR.E, conditon: [DIR.E, DIR.SE, DIR.NE] },
];

const map = new Map<string, Elf>();

export default function (input: string[], { logger }: Context) {
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] === ".") {
                continue;
            }

            map.set(new Vec2(x, y).toString(), new Vec2(x, y));
        }
    }

    for (let round = 0; ; round++) {
        const proposed = new Map<string, Suggestion>();

        const sugStart = round % CHECKS.length;
        let hadMove = false;

        for (const elf of map.values()) {
            let moves = false;

            for (let i = 0; i < ALL_DIRS.length; i++) {
                if (map.has(Vec2.add(elf, ALL_DIRS[i]).toString())) {
                    moves = true;
                    break;
                }
            }

            if (!moves) {
                continue;
            }

            hadMove ||= moves;

            for (let i = 0; i < CHECKS.length; i++) {
                const check = CHECKS[(i + sugStart) % CHECKS.length];

                let canMove = true;
                for (let j = 0; j < check.conditon.length; j++) {
                    if (map.has(Vec2.add(elf, check.conditon[j]).toString())) {
                        canMove = false;
                        break;
                    }
                }

                if (!canMove) {
                    continue;
                }

                const np = Vec2.add(elf, check.move);
                const npid = np.toString();

                if (!proposed.has(npid)) {
                    proposed.set(npid, { pos: np, from: [] });
                }

                proposed.get(npid).from.push(elf);
                break;
            }
        }

        if (!hadMove) {
            return round + 1;
        }

        for (const [key, value] of proposed.entries()) {
            if (value.from.length === 1) {
                map.delete(value.from[0].toString());
                map.set(key, value.pos);
                continue;
            }
        }
    }
}
