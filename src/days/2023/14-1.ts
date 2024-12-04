import {} from "@lib/input";
import { Context } from "@app/types";
import { create } from "@lib/array2d";
import { stdout } from "process";

export default function (input: string[], { logger }: Context) {
    const grid = create(input[0].length, input.length, ".");

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            grid[y][x] = input[y][x];
        }
    }

    let sum = 0;

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

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== "O") {
                continue;
            }

            sum += grid.length - y;
        }
    }

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            stdout.write(grid[y][x]);
        }
        stdout.write("\n");
    }

    return sum;
}
