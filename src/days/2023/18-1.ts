import { } from '@lib/input';
import { Context } from '@app/types';
import { Grid2D, create } from '@lib/array2d';
import { Vec2 } from '@lib/math';
import { stdout } from 'process';

interface Instruction {
    direction: Vec2;
    length: number;
    color: string;
}

export default function (input: string[], { logger }: Context) {
    const map = new Map<string, string>();

    const min = new Vec2(0, 0);
    const max = new Vec2(0, 0);
    const pos = new Vec2(0, 0);

    const instructions = input.map(parse);

    instructions.forEach((instr) => {
        for (let i = 0; i < instr.length; i++) {
            if (pos.x > max.x) max.x = pos.x;
            if (pos.y > max.y) max.y = pos.y;
            if (pos.y < min.y) min.y = pos.y;
            if (pos.x < min.x) min.x = pos.x;

            map.set(pos.toString(), instr.color);
            pos.add(instr.direction);
        }
    });

    const queue: Vec2[] = [
        Vec2.add(
            Vec2.mult(instructions[0].direction, (instructions[0].length / 2) | 0),
            Vec2.rotate(instructions[0].direction, 90, 'deg'),
        ),
    ];

    while (queue.length > 0) {
        const p = queue.shift()!;

        // We already visited this point
        if (map.has(p.toString())) continue;

        map.set(p.toString(), '#');

        for (const n of [Vec2.DOWN, Vec2.UP, Vec2.LEFT, Vec2.RIGHT]) {
            if (map.has(Vec2.add(p, n).toString())) continue;

            queue.push(Vec2.add(p, n));
        }
    }

    return map.size;
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
        case 'L': return new Vec2(-1, 0);
        case 'R': return new Vec2(1, 0);
        case 'U': return new Vec2(0, -1);
        case 'D': return new Vec2(0, 1);

        default: throw new Error(`Invalid direction: ${char}`);
    }
}
