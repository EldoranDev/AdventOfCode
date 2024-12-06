import {} from "@lib/input";
import { Context } from "@app/types";
import { Grid2D } from "@lib/array2d";
import { Vec2 } from "@lib/math";

const GUARD = "^";
const BLOCKER = "#";
const FREE = ".";

export default function (input: string[], { logger }: Context) {
    const grid: Grid2D<string> = input.map((line) => line.split(""));
    const start = getStartPosition(grid);

    const options = getPath(grid, start);
    let loops = 0;

    for (const option of options) {
        if (option.equals(start)) {
            continue;
        }

        grid[option.y][option.x] = BLOCKER;

        if (getPath(grid, start) === null) {
            loops++;
        }

        grid[option.y][option.x] = FREE;
    }

    return loops;
}

function getPath(grid: Grid2D<string>, start: Vec2): Vec2[] | null {
    let guard = start.clone();
    const direction = new Vec2(0, -1);

    const loopMap = new Set<string>();
    const map = new Map<string, Vec2>();

    for (;;) {
        const np = Vec2.add(guard, direction);

        if (np.x < 0 || np.y < 0 || np.y >= grid.length || np.x >= grid[np.y].length) {
            break;
        }

        if (loopMap.has(`${np.toString()}-${direction.toString()}`)) {
            return null;
        }

        if (grid[np.y][np.x] !== BLOCKER) {
            if (!map.has(np.toString())) {
                map.set(np.toString(), np.clone());
                loopMap.add(`${np.toString()}-${direction.toString()}`);
            }

            guard = np;
        } else {
            direction.rotate(90, "deg");
        }
    }

    return [...map.values()];
}

function getStartPosition(grid: Grid2D<string>): Vec2 {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === GUARD) {
                return new Vec2(x, y);
            }
        }
    }
}
