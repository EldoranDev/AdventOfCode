import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { memoize } from "@lib/functools";

type KeyPad = "number" | "direction";

const PANEL_NUM = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["#", "0", "A"],
];

const PANEL_DIR = [
    ["#", "^", "A"],
    ["<", "v", ">"],
];

const ORDER: KeyPad[] = ["number", "direction", "direction"];

const DIRS = { "<": 0, v: 1, "^": 2, ">": 3 };

export default function (input: string[], { logger }: Context) {
    let instructions = [...input.map((line) => line.split(""))];

    for (const pad of ORDER) {
        instructions = instructions.map((instr) => {
            const res: string[] = [];
            let pos = "A";

            console.log(instr.join(""));

            for (let i = 0; i < instr.length; i++) {
                res.push(...getInstructions(pos, instr[i], pad));
                pos = instr[i];
            }

            return res;
        });
    }

    let sum = 0;

    for (let i = 0; i < input.length; i++) {
        const padNum = Number(input[i].substring(0, 3));
        // console.log(instructions[i]);
        console.log(padNum, instructions[i].length);

        console.log(instructions[i].join(""));

        sum += padNum * instructions[i].length;
    }

    return sum;
}

function getPath(from: string, to: string, pad: KeyPad): string[] {
    const start = getPos(from, pad);
    const end = getPos(to, pad);

    const KP = pad === "direction" ? PANEL_DIR : PANEL_NUM;

    const diff = Vec2.sub(end, start);

    const directions = [];

    for (let i = 0; i < Math.abs(diff.x); i++) {
        directions.push(Math.sign(diff.x) === 1 ? ">" : "<");
    }

    for (let i = 0; i < Math.abs(diff.y); i++) {
        directions.push(Math.sign(diff.y) === 1 ? "v" : "^");
    }

    directions.sort((a, b) => DIRS[a] - DIRS[b]);

    for (const dir of directions) {
        start.add(getVec(dir));

        if (KP[start.y][start.x] === "#") {
            directions.reverse();
            break;
        }
    }

    return directions;
}

function getPos(key: string, pad: KeyPad): Vec2 {
    const pa = pad === "direction" ? PANEL_DIR : PANEL_NUM;

    for (let y = 0; y < pa.length; y++) {
        for (let x = 0; x < pa[y].length; x++) {
            if (pa[y][x] === key) {
                return new Vec2(x, y);
            }
        }
    }
}

function getVec(dir: string): Vec2 {
    switch (dir) {
        case ">":
            return new Vec2(1, 0);
        case "<":
            return new Vec2(-1, 0);
        case "^":
            return new Vec2(0, -1);
        case "v":
            return new Vec2(0, 1);
    }
}

function getDir(dir: Vec2): string {
    if (dir.equals(new Vec2(1, 0))) {
        return ">";
    }

    if (dir.equals(new Vec2(-1, 0))) {
        return "<";
    }

    if (dir.equals(new Vec2(0, 1))) {
        return "v";
    }

    if (dir.equals(new Vec2(0, -1))) {
        return "^";
    }
}

function getInstructions(from: string, to: string, panel: KeyPad): string[] {
    const path = getPath(from, to, panel);

    console.log(`${from} -> ${to}: ${path.join("")}A`);

    return [...path, "A"];
}

const getInstractionsMem = memoize(getInstructions);
const getPathMem = memoize(getPath);
