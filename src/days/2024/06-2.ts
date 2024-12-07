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
    const options = getPOI(grid, start);

    let loops = 0;

    for (const option of options) {
        if (option.equals(start)) {
            continue;
        }

        grid[option.y][option.x] = BLOCKER;

        if (hasLoop(grid, start)) {
            loops++;
        }

        grid[option.y][option.x] = FREE;
    }

    return loops;
}

function getPOI(grid: Grid2D<string>, start: Vec2): Vec2[] {
    let guard = start.clone();

    const direction = new Vec2(0, -1);
    const points = [];

    const set = new Set<string>();

    for (;;) {
        const np = Vec2.add(guard, direction);

        if (np.x < 0 || np.y < 0 || np.y >= grid.length || np.x >= grid[np.y].length) {
            return points;
        }

        if (grid[np.y][np.x] !== BLOCKER) {
            if (!set.has(np.toString())) {
                set.add(np.toString());
                points.push(np.clone());
            }

            guard = np;
        } else {
            direction.rotate(90, "deg");
        }
    }
}

function hasLoop(grid: Grid2D<string>, start: Vec2): boolean {
    const guard = start.clone();

    const direction = new Vec2(0, -1);
    const loopMap = new Set<string>();

    for (;;) {
        guard.add(direction);

        if (
            guard.x < 0 ||
            guard.y < 0 ||
            guard.y >= grid.length ||
            guard.x >= grid[guard.y].length
        ) {
            break;
        }

        if (loopMap.has(`${guard.toString()}-${direction.toString()}`)) {
            return true;
        }

        if (grid[guard.y][guard.x] !== BLOCKER) {
            loopMap.add(`${guard.toString()}-${direction.toString()}`);
        } else {
            guard.sub(direction);
            direction.rotate(90, "deg");
        }
    }

    return false;
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
