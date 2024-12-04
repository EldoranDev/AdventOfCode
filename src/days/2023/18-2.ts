/* eslint-disable max-len */
import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

type Point = [bigint, bigint];

interface Instruction {
    direction: Point;
    length: bigint;
    color: string;
}

export default function (input: string[], { logger }: Context) {
    let x: bigint = 0n;
    let y: bigint = 0n;

    const instructions = input.map(parse);

    const points: Point[] = [];

    let perim = 0n;

    instructions.forEach((instr) => {
        x += instr.direction[0] * instr.length;
        y += instr.direction[1] * instr.length;

        perim += instr.length;

        points.push([x, y]);
    });

    // https://en.wikipedia.org/wiki/Pick%27s_theorem
    // https://www.101computing.net/the-shoelace-algorithm/
    return shoelace(points) + (perim >> 1n) + 1n;
}

function parse(line: string): Instruction {
    const [, , color] = /([LRDU])\s(\d+)\s\(#([\da-z]{6})\)/.exec(line).slice(1);

    console.log(
        color,
        getDir(color[color.length - 1]),
        parseInt(color.substring(0, color.length - 1), 16),
    );

    return {
        direction: getDirVec(getDir(color[color.length - 1])),
        length: BigInt(parseInt(color.substring(0, color.length - 1), 16)),
        color,
    };
}

function shoelace(points: Point[]): bigint {
    let res = 0n;

    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % points.length];

        res += x1 * y2 - y1 * x2;
    }

    return res >> 1n;
}

function getDir(char: string): string {
    switch (char) {
        case "0":
            return "R";
        case "1":
            return "D";
        case "2":
            return "L";
        case "3":
            return "U";

        default:
            throw new Error(`Invalid direction: ${char}`);
    }
}

function getDirVec(char: string): Point {
    switch (char) {
        case "L":
            return [-1n, 0n];
        case "R":
            return [1n, 0n];
        case "U":
            return [0n, -1n];
        case "D":
            return [0n, 1n];

        default:
            throw new Error(`Invalid direction: ${char}`);
    }
}
