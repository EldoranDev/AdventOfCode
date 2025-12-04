import {} from "@lib/input";
import { Context } from "@app/types";
import { create, Grid2D } from "@lib/array2d";
import { Vec2 } from "@lib/math";

const POS = [
    new Vec2(0, 1),
    new Vec2(0, -1),
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(1, 1),
    new Vec2(1, -1),
    new Vec2(-1, 1),
    new Vec2(-1, -1),
];

export default function (input: string[], { logger }: Context) {
    const grid = create(input[0].length, input.length, "");

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            grid[y][x] = input[y][x];
        }
    }

    let count = 0;

    let remove: Array<Vec2> = [];

    do {
        for (const r of remove) {
            grid[r.y][r.x] = ".";
        }

        remove = [];

        for (let y = 0; y < input.length; y++) {
            for (let x = 0; x < input[y].length; x++) {
                if (grid[y][x] === "@" && getNeighbours(x, y, grid) < 4) {
                    count++;
                    remove.push(new Vec2(x, y));
                }
            }
        }
    } while (remove.length > 0);

    return count;
}

function getNeighbours(x: number, y: number, grid: Grid2D<string>): number {
    let count = 0;
    for (const p of POS) {
        const t = Vec2.add(new Vec2(x, y), p);

        if (t.x < 0 || t.y < 0 || t.y >= grid.length || t.x >= grid[y].length) {
            continue;
        }

        if (grid[t.y][t.x] !== ".") {
            count++;
        }
    }

    return count;
}
