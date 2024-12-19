import { Grid2D } from "./create";

export function print<T>(grid: Grid2D<T>) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            process.stdout.write(String(grid[y][x]));
        }
        process.stdout.write("\n");
    }
}
