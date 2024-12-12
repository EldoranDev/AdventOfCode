import {} from "@lib/input";
import { Context } from "@app/types";
import { Grid2D } from "@lib/array2d";
import { Vec2 } from "@lib/math";

type Plot = Vec2[];

export default function (input: string[], { logger }: Context) {
    const grid: Grid2D<string> = input.map((line) => line.split(""));
    const checked = new Set<string>();
    const plots: Plot[] = [];

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const p = new Vec2(x, y);

            if (checked.has(p.toString())) {
                continue;
            }

            checked.add(p.toString());

            plots.push(getPlot(p, grid, checked));
        }
    }

    let sum = 0;

    for (const plot of plots) {
        const sides = countCorners(plot, grid);

        sum += plot.length * sides;
    }

    return sum;
}

function getPlot(start: Vec2, grid: Grid2D<string>, checked: Set<string>): Plot {
    const crop = get(start.y, start.x, grid);
    const plot = [start];

    const open = [start];

    while (open.length > 0) {
        const curr = open.pop();

        for (const dir of Vec2.ULRD) {
            const np = Vec2.add(curr, dir);

            if (get(np.y, np.x, grid) !== crop) {
                continue;
            }

            // console.log(crop, get(np.y, np.x, grid));
            if (!checked.has(np.toString())) {
                checked.add(np.toString());

                plot.push(np);
                open.push(np);
            }
        }
    }

    return plot;
}

function countCorners(plot: Plot, map: Grid2D<string>): number {
    let corners = 0;

    const crop = get(plot[0].y, plot[0].x, map);

    for (const p of plot) {
        // Getting all relevant points for checking
        const l = get(p.y, p.x - 1, map);
        const tl = get(p.y - 1, p.x - 1, map);
        const t = get(p.y - 1, p.x, map);
        const tr = get(p.y - 1, p.x + 1, map);
        const r = get(p.y, p.x + 1, map);
        const br = get(p.y + 1, p.x + 1, map);
        const b = get(p.y + 1, p.x, map);
        const bl = get(p.y + 1, p.x - 1, map);

        // Top left corner
        if (l !== crop && t !== crop) {
            corners += 1;
        }

        // Top right corner
        if (t !== crop && r !== crop) {
            corners += 1;
        }

        // Bottom right Corner
        if (r !== crop && b !== crop) {
            corners += 1;
        }

        // Bottom left corner
        if (b !== crop && l !== crop) {
            corners += 1;
        }

        // bottom right inner corner
        if (r === crop && b === crop && br !== crop) {
            corners += 1;
        }

        // bottom left inner corner
        if (l === crop && b === crop && bl !== crop) {
            corners += 1;
        }

        // top left inner corner
        if (t === crop && l === crop && tl !== crop) {
            corners += 1;
        }

        if (t === crop && r === crop && tr !== crop) {
            corners += 1;
        }
    }

    return corners;
}

function get(y: number, x: number, grid: Grid2D<string>): string {
    if (y < 0 || x < 0 || y >= grid.length || x >= grid[y].length) {
        return "";
    }

    return grid[y][x];
}
