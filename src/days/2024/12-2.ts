import {} from "@lib/input";
import { Context } from "@app/types";
import { Grid2D } from "@lib/array2d";
import { Vec2 } from "@lib/math";

export default function (input: string[], { logger }: Context) {
    const grid: Grid2D<string> = input.map((line) => line.split(""));
    const checked = new Set<string>();

    let sum = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const p = new Vec2(y, x);

            if (checked.has(p.toString())) {
                continue;
            }

            checked.add(p.toString());

            sum += getPrice(p, grid, checked);
        }
    }

    return sum;
}

function getPrice(start: Vec2, grid: Grid2D<string>, checked: Set<string>): number {
    const plot = grid[start.y][start.x];

    let area = 0;
    let perimter = 0;

    const open: Vec2[] = [start];

    while (open.length > 0) {
        const curr = open.pop();

        area++;

        for (const dir of Vec2.ULRD) {
            const np = Vec2.add(curr, dir);

            if (np.x < 0 || np.y < 0 || np.y >= grid.length || np.x >= grid[np.y].length) {
                perimter += 1;
                continue;
            }

            if (grid[np.y][np.x] !== plot) {
                perimter += 1;
                continue;
            }

            if (!checked.has(np.toString())) {
                checked.add(np.toString());

                open.push(np);
            }
        }
    }

    return area * perimter;
}
