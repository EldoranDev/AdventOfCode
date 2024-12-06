import {} from "@lib/input";
import { Context } from "@app/types";
import { Grid2D } from "@lib/array2d";
import { Vec2 } from "@lib/math";

const GUARD = "^";
const BLOCKER = "#";
const VISITED = "X";

export default function (input: string[], { logger }: Context) {
    const grid: Grid2D<string> = input.map((line) => line.split(""));
    let guard = getStartPosition(grid);

    const direction = new Vec2(0, -1);

    let count = 1;

    for (;;) {
        const np = Vec2.add(guard, direction);

        if (np.x < 0 || np.y < 0 || np.y >= grid.length || np.x >= grid[np.y].length) {
            break;
        }

        if (grid[np.y][np.x] !== BLOCKER) {
            if (grid[np.y][np.x] !== VISITED) {
                grid[np.y][np.x] = VISITED;
                count++;
            }

            guard = np;
        } else {
            direction.rotate(90, "deg");
        }
    }

    return count;
}

function getStartPosition(grid: Grid2D<string>): Vec2 {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === GUARD) {
                grid[y][x] = VISITED;
                return new Vec2(x, y);
            }
        }
    }
}
