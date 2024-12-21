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

const DIRS = { "<": 0, v: 1, "^": 2, ">": 3 };

export default function (input: string[], { logger, test }: Context) {
    const DEPTH = test ? 2 : 25;

    let sum = 0;

    for (const line of input) {
        const padNum = Number(line.substring(0, 3));

        sum += padNum * getDirectionsForBlock(line, "number", DEPTH);
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

function getDirections(from: string, to: string, panel: KeyPad): string[] {
    const path = getPath(from, to, panel);

    return [...path, "A"];
}

function getDirectionsForBlock(block: string, pad: KeyPad, depth: number): number {
    const res = [];
    let pos = "A";

    for (let i = 0; i < block.length; i++) {
        res.push(...getDirections(pos, block[i], pad));
        pos = block[i];
    }

    if (depth === 0) {
        return res.length;
    }

    const blocks = res
        .join("")
        .split("A")
        .map((p) => p + "A");
    blocks.pop();

    let sum = 0;

    for (const b of blocks) {
        sum += getDirectionsForBlockMem(b, "direction", depth - 1);
    }

    return sum;
}

const getDirectionsForBlockMem = memoize(getDirectionsForBlock);
