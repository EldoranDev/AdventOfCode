import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

interface Instruction {
    direction: Vec2;
    length: number;
    color: string;
}

export default function (input: string[], { logger }: Context) {
    const pos = new Vec2(0, 0);

    const instructions = input.map(parse);

    const points: Vec2[] = [];

    let perim = 0;

    instructions.forEach((instr) => {
        points.push(pos.clone());
        pos.add(Vec2.mult(instr.direction, instr.length));
        perim += instr.length;
    });

    let l = 0;
    let r = 0;

    for (let i = 0; i < points.length; i++) {
        l += points[i].x * points[(i + 1) % points.length].y;
        r += points[i].y * points[(i + 1) % points.length].x;
    }

    const area = (l - r) >> 1;

    // https://en.wikipedia.org/wiki/Pick%27s_theorem
    // https://www.101computing.net/the-shoelace-algorithm/
    return area + (perim >> 1) + 1;
}

function parse(line: string): Instruction {
    const [dir, length, color] = /([LRDU])\s(\d+)\s\(#([\da-z]{6})\)/.exec(line).slice(1);

    return {
        direction: getDir(dir),
        length: parseInt(length, 10),
        color,
    };
}

function getDir(char: string): Vec2 {
    switch (char) {
        case "L":
            return new Vec2(-1, 0);
        case "R":
            return new Vec2(1, 0);
        case "U":
            return new Vec2(0, -1);
        case "D":
            return new Vec2(0, 1);

        default:
            throw new Error(`Invalid direction: ${char}`);
    }
}
