/* eslint-disable no-param-reassign */
import {} from "@lib/input";
import { Context } from "@app/types";
import { Grid2D, create } from "@lib/array2d";
import { stdout } from "process";
import { createHash } from "crypto";

const CYCLES = 1_000_000_000;

export default function (input: string[], { logger }: Context) {
    const grid = create(input[0].length, input.length, ".");

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            grid[y][x] = input[y][x];
        }
    }

    const configs = new Map<string, number>();

    for (let i = 0; i < CYCLES; i++) {
        rotate(grid);

        const config = getConfig(grid);

        if (configs.has(config)) {
            const cycleLength = getCycleLength(grid);

            const remaining = (CYCLES - i - 1) % cycleLength;

            for (let ii = 0; ii < remaining; ii++) {
                rotate(grid);
            }

            return configs.get(getConfig(grid));
        }

        configs.set(config, getScore(grid));
    }

    return configs.get(getConfig(grid));
}

function rotate(grid: Grid2D<string>): void {
    tiltNorth(grid);
    tiltWest(grid);
    tiltSouth(grid);
    tiltEast(grid);
}

function getCycleLength(grid: Grid2D<string>): number {
    const start = getConfig(grid);

    let current = start;
    let count = 0;
    do {
        count++;
        rotate(grid);
        current = getConfig(grid);
    } while (current !== start);

    return count;
}

function tiltNorth(grid: Grid2D<string>): void {
    for (let y = 1; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== "O") {
                continue;
            }

            let yy = y;

            do {
                yy--;
            } while (yy > 0 && grid[yy][x] === ".");

            if (grid[yy][x] !== ".") {
                yy++;
            }

            grid[y][x] = ".";
            grid[yy][x] = "O";
        }
    }
}

function tiltWest(grid: Grid2D<string>): void {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 1; x < grid[y].length; x++) {
            if (grid[y][x] !== "O") {
                continue;
            }

            let xx = x;

            do {
                xx--;
            } while (xx > 0 && grid[y][xx] === ".");

            if (grid[y][xx] !== ".") {
                xx++;
            }

            grid[y][x] = ".";
            grid[y][xx] = "O";
        }
    }
}

function tiltSouth(grid: Grid2D<string>): void {
    for (let y = grid.length - 2; y >= 0; y--) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== "O") {
                continue;
            }

            let yy = y;

            do {
                yy++;
            } while (yy < grid.length - 1 && grid[yy][x] === ".");

            if (grid[yy][x] !== ".") {
                yy--;
            }

            grid[y][x] = ".";
            grid[yy][x] = "O";
        }
    }
}

function tiltEast(grid: Grid2D<string>): void {
    for (let y = 0; y < grid.length; y++) {
        for (let x = grid[y].length - 2; x >= 0; x--) {
            if (grid[y][x] !== "O") {
                continue;
            }

            let xx = x;

            do {
                xx++;
            } while (xx < grid[y].length - 1 && grid[y][xx] === ".");

            if (grid[y][xx] !== ".") {
                xx--;
            }

            grid[y][x] = ".";
            grid[y][xx] = "O";
        }
    }
}

function getConfig(grid: Grid2D<string>): string {
    const config = Array.from({ length: grid.length }, () => "");

    for (let y = 0; y < grid.length; y++) {
        config[y] = grid[y].join("");
    }

    const md5 = createHash("md5");

    return md5.update(config.join("-")).digest("hex");
}

function getScore(grid: Grid2D<string>): number {
    let sum = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== "O") {
                continue;
            }

            sum += grid.length - y;
        }
    }

    return sum;
}

function print(grid: Grid2D<string>): void {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            stdout.write(grid[y][x]);
        }
        stdout.write("\n");
    }
}
