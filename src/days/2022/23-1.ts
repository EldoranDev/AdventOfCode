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

const CHECKS: Array<Check> = [
    { move: DIR.N, conditon: [DIR.N, DIR.NE, DIR.NW] },
    { move: DIR.S, conditon: [DIR.S, DIR.SE, DIR.SW] },
    { move: DIR.W, conditon: [DIR.W, DIR.NW, DIR.SW] },
    { move: DIR.E, conditon: [DIR.E, DIR.SE, DIR.NE] },
];

const ROUNDS = 10;

let map = new Map<string, Elf>();

export default function (input: string[], { logger }: Context) {
    let min = new Vec2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    let max = new Vec2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] === ".") {
                continue;
            }

            map.set(new Vec2(x, y).toString(), new Vec2(x, y));

            if (min.x > x) {
                min.x = x;
            }

            if (min.y > y) {
                min.y = y;
            }

            if (max.x < x) {
                max.x = x;
            }

            if (max.y < y) {
                max.y = y;
            }
        }
    }

    for (let round = 0; round < ROUNDS; round++) {
        // Part 1 of the round
        const proposed = new Map<string, Suggestion>();

        // Rotate suggestions
        const sugStart = round % CHECKS.length;
        let hadMove = false;

        console.log(min, max);
        console.log(map.size);

        for (const elf of map.values()) {
            const moves =
                Object.values(DIR)
                    .map((dir) => map.has(Vec2.add(elf, dir).toString()))
                    .filter((v) => v).length > 0;

            if (!moves) {
                // Elf does not check any directions and just stays at its place
                proposed.set(elf.toString(), { pos: elf, from: [elf.clone()] });
                continue;
            }

            hadMove ||= moves;

            let didMove = false;

            for (let i = 0; i < CHECKS.length; i++) {
                const check = CHECKS[(i + sugStart) % CHECKS.length];

                const canMove =
                    check.conditon.map((n) => map.has(Vec2.add(elf, n).toString())).filter((v) => v)
                        .length === 0;

                if (!canMove) {
                    // Direction can not get moved into
                    continue;
                }

                const np = Vec2.add(elf, check.move);

                if (!proposed.has(np.toString())) {
                    proposed.set(np.toString(), { pos: np, from: [] });
                }

                proposed.get(np.toString()).from.push(elf);
                didMove = true;
                break;
            }

            if (!didMove) {
                proposed.set(elf.toString(), { pos: elf, from: [elf.clone()] });
            }
        }

        if (!hadMove) {
            console.log("No move required anymore");
            break;
        }

        // Part 2 of the round
        const newMap = new Map<string, Vec2>();
        const newMin = new Vec2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        const newMax = new Vec2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

        for (const suggestion of proposed.values()) {
            if (suggestion.from.length === 1) {
                if (suggestion.pos.x > newMax.x) {
                    newMax.x = suggestion.pos.x;
                }

                if (suggestion.pos.y > newMax.y) {
                    newMax.y = suggestion.pos.y;
                }

                if (suggestion.pos.x < newMin.x) {
                    newMin.x = suggestion.pos.x;
                }

                if (suggestion.pos.y < newMin.y) {
                    newMin.y = suggestion.pos.y;
                }

                newMap.set(suggestion.pos.toString(), suggestion.pos);
                continue;
            }

            suggestion.from.forEach((pos) => {
                newMap.set(pos.toString(), pos);
            });
        }

        map = newMap;
        max = newMax;
        min = newMin;
    }

    let count = 0;
    let output = "";

    for (let { y } = min; y <= max.y; y++) {
        for (let { x } = min; x <= max.x; x++) {
            if (map.has(new Vec2(x, y).toString())) {
                output += "#";
                continue;
            }

            output += ".";

            count++;
        }

        output += "\n";
    }

    console.log(output);

    return count;
}
