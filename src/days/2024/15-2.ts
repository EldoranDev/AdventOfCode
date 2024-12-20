/* eslint-disable no-case-declarations */
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

    const map = expand(inputMap.map((line) => line.split("")));
    const instructions = inputInstructions.join("").split("");

    const pos = getPoint(map, "@");

    for (const instr of instructions) {
        const fp = Vec2.add(pos, DIRS[instr]);

        // trying to run against a wall
        if (map[fp.y][fp.x] === "#") {
            continue;
        }

        // simply moving
        if (map[fp.y][fp.x] === ".") {
            map[pos.y][pos.x] = ".";
            map[fp.y][fp.x] = "@";
            pos.add(DIRS[instr]);
            continue;
        }

        if (instr === "<" || instr === ">") {
            let curr = map[fp.y][fp.x];
            let count = 0;

            while (curr === "[" || curr === "]") {
                fp.add(DIRS[instr]);
                curr = map[fp.y][fp.x];
                count++;
            }

            if (curr === "#") {
                // trying to push against a wall
                continue;
            }

            for (let i = 0; i < count; i++) {
                const np = Vec2.sub(fp, DIRS[instr]);
                map[fp.y][fp.x] = map[np.y][np.x];

                fp.sub(DIRS[instr]);
            }

            map[pos.y][pos.x] = ".";
            pos.add(DIRS[instr]);
            map[pos.y][pos.x] = "@";
        } else {
            if (canMove(pos, DIRS[instr], map)) {
                move(pos, DIRS[instr], map);
            }
        }
    }

    let sum = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "[") {
                sum += y * 100 + x;
            }
            process.stdout.write(map[y][x]);
        }
        process.stdout.write("\n");
    }

    return sum;
}

function canMove(pos: Vec2, dir: Vec2, map: string[][]): boolean {
    if (map[pos.y][pos.x] === "#") {
        return false;
    }

    if (map[pos.y][pos.x] === ".") {
        return true;
    }

    switch (map[pos.y][pos.x]) {
        case "#":
            return false;
        case ".":
            return true;
        case "@":
            return canMove(Vec2.add(pos, dir), dir, map);
        case "[":
            return (
                canMove(Vec2.add(pos, dir), dir, map) &&
                canMove(Vec2.add(Vec2.add(pos, dir), new Vec2(1, 0)), dir, map)
            );
        case "]":
            return (
                canMove(Vec2.add(pos, dir), dir, map) &&
                canMove(Vec2.add(Vec2.add(pos, dir), new Vec2(-1, 0)), dir, map)
            );
    }
}

// Doesn't check if its possible or allowed
function move(pos: Vec2, dir: Vec2, map: string[][]) {
    switch (map[pos.y][pos.x]) {
        case "@":
            move(Vec2.add(pos, dir), dir, map);
            break;
        case "[":
            move(Vec2.add(pos, dir), dir, map);
            move(Vec2.add(Vec2.add(pos, dir), new Vec2(1, 0)), dir, map);
            break;
        case "]":
            move(Vec2.add(pos, dir), dir, map);
            move(Vec2.add(Vec2.add(pos, dir), new Vec2(-1, 0)), dir, map);
            break;
        default:
            return;
    }

    const np = Vec2.add(pos, dir);

    switch (map[pos.y][pos.x]) {
        case "@":
            map[np.y][np.x] = map[pos.y][pos.x];
            map[pos.y][pos.x] = ".";
            pos.add(dir);
            break;
        case "[":
            const apr = Vec2.add(new Vec2(1, 0), np);
            const opr = Vec2.add(new Vec2(1, 0), pos);
            map[np.y][np.x] = map[pos.y][pos.x];
            map[apr.y][apr.x] = map[opr.y][opr.x];

            map[pos.y][pos.x] = ".";
            map[opr.y][opr.x] = ".";
            break;
        case "]":
            const apl = Vec2.add(new Vec2(-1, 0), np);
            const opl = Vec2.add(new Vec2(-1, 0), pos);
            map[np.y][np.x] = map[pos.y][pos.x];
            map[apl.y][apl.x] = map[opl.y][opl.x];

            map[pos.y][pos.x] = ".";
            map[opl.y][opl.x] = ".";
            break;
    }
}

function expand(map: string[][]): string[][] {
    const nm = [];

    for (let y = 0; y < map.length; y++) {
        nm.push([]);
        for (let x = 0; x < map[y].length; x++) {
            switch (map[y][x]) {
                case "#":
                    nm[y].push("#", "#");
                    break;
                case ".":
                    nm[y].push(".", ".");
                    break;
                case "@":
                    nm[y].push("@", ".");
                    break;
                case "O":
                    nm[y].push("[", "]");
                    break;
            }
        }
    }

    return nm;
}

function print(map: string[][]) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            process.stdout.write(map[y][x]);
        }
        process.stdout.write("\n");
    }
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
