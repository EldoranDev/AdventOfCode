import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

const DIRS = {
    "<": new Vec2(-1, 0),
    ">": new Vec2(1, 0),
    "^": new Vec2(0, -1),
    v: new Vec2(0, 1),
};

export default function (input: string[], { logger }: Context) {
    const [inputMap, inputInstructions] = getLineGroups(input);

    const map = inputMap.map((line) => line.split(""));
    const instructions = inputInstructions.join("").split("");

    const pos = getPoint(map, "@");

    map[pos.y][pos.x] = ".";

    for (const instr of instructions) {
        const fp = Vec2.add(pos, DIRS[instr]);

        // trying to run against a wall
        if (map[fp.y][fp.x] === "#") {
            continue;
        }

        // simply moving
        if (map[fp.y][fp.x] === ".") {
            pos.add(DIRS[instr]);
            continue;
        }

        let curr = map[fp.y][fp.x];

        let count = 0;

        while (curr === "O") {
            fp.add(DIRS[instr]);
            curr = map[fp.y][fp.x];
            count++;
        }

        if (curr === "#") {
            // trying to push against a wall
            continue;
        }

        for (let i = 0; i < count; i++) {
            map[fp.y][fp.x] = "O";
            fp.sub(DIRS[instr]);
        }

        pos.add(DIRS[instr]);
        map[pos.y][pos.x] = ".";
    }

    let sum = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "O") {
                sum += y * 100 + x;
            }
            process.stdout.write(map[y][x]);
        }
        process.stdout.write("\n");
    }

    return sum;
}

function getPoint(map: string[][], point: string): Vec2 {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === point) {
                return new Vec2(x, y);
            }
        }
    }

    throw new Error("Could not find start point");
}
