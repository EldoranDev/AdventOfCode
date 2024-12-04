/* eslint-disable no-param-reassign */
import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { create } from "@lib/array2d";
import { Grid2D } from "@lib/array2d/create";

const BUFFER = 10;

type Structure = Array<Vec2>;
type Grid = Grid2D<number>;

export default function (input: string[], { logger }: Context) {
    const structures: Array<Structure> = [];

    const size = new Vec2(0, 0);

    for (const line of input) {
        structures.push(
            line
                .split("->")
                .map((p) => p.trim())
                .map((p) => {
                    const [x, y] = p.split(",").map((c) => Number(c));

                    if (x > size.x) {
                        size.x = x;
                    }

                    if (y > size.y) {
                        size.y = y;
                    }

                    return new Vec2(x, y);
                }),
        );
    }

    const grid = create(size.x + BUFFER, size.y + BUFFER, 0);

    for (const struct of structures) {
        for (let i = 0; i < struct.length - 1; i++) {
            drawLine(struct[i], struct[i + 1], grid);
        }
    }

    let intoVoid = false;
    let count = 0;
    while (!intoVoid) {
        intoVoid = sim(grid);
        count++;
    }

    // print(grid, new Vec2(493, 0), 11, 12);

    return count - 1;
}

const DIRS = [new Vec2(0, 1), new Vec2(-1, 1), new Vec2(1, 1)];

function sim(grid: Grid): boolean {
    const current = new Vec2(500, 0);

    let resting = false;

    while (!resting) {
        resting = true;

        for (const dir of DIRS) {
            const d = Vec2.add(current, dir);

            if (d.y >= grid.length) {
                return true;
            }

            if (grid[d.y][d.x] === 0) {
                resting = false;
                current.add(dir);
                break;
            }
        }
    }

    grid[current.y][current.x] = 2;

    return false;
}

function drawLine(from: Vec2, to: Vec2, grid: Grid): void {
    const dir = Vec2.sub(to, from).setLength(1);

    const current = from.clone();

    while (!current.equals(to)) {
        grid[current.y][current.x] = 1;

        current.add(dir);
    }
    grid[current.y][current.x] = 1;
}

// #region Debugging
function print(grid: Grid2D<number>, from: Vec2, rows?: number, cols?: number): void {
    const DRAW = [".", "#", "o"];

    if (rows === undefined) {
        rows = grid.length;
    }

    if (cols === undefined) {
        cols = grid[0].length;
    }

    let out = "";

    for (let { y } = from; y < from.y + rows; y++) {
        for (let { x } = from; x < from.x + cols; x++) {
            out += DRAW[grid[y][x]];
        }
        out += "\n";
    }

    console.log(out);
}

// #endregion
