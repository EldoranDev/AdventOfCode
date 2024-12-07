import {} from "@lib/input";
import { Context } from "@app/types";
import { Grid2D } from "@lib/array2d";
import { Vec2 } from "@lib/math";

const GUARD = "^";
const BLOCKER = "#";

type AbstractMap = { rows: Map<number, number[]>; columns: Map<number, number[]>; start: Vec2 };

export default function (input: string[], { logger }: Context) {
    const grid: Grid2D<string> = input.map((line) => line.split(""));
    const map = buildAbstractMap(grid);

    const options = getPOI(grid, map.start);

    let loops = 0;

    for (const option of options) {
        if (option.equals(map.start)) {
            continue;
        }

        if (!map.rows.has(option.y)) {
            map.rows.set(option.y, []);
        }

        if (!map.columns.has(option.x)) {
            map.columns.set(option.x, []);
        }

        const row = map.rows.get(option.y);
        const col = map.columns.get(option.x);

        row.push(option.x);
        col.push(option.y);

        row.sort((a, b) => a - b);
        col.sort((a, b) => a - b);

        if (hasLoop(map)) {
            loops++;
        }

        row.splice(row.indexOf(option.x), 1);
        col.splice(col.indexOf(option.y), 1);
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

function hasLoop(map: AbstractMap): boolean {
    const guard = map.start.clone();

    const direction = new Vec2(0, -1);
    const loopMap = new Set<string>();

    let nn: number | null = null;

    for (;;) {
        if (direction.y !== 0) {
            nn = getNext(map.columns.get(guard.x), guard.y, direction.y);

            if (nn === null) {
                // Left the map on y axis
                return false;
            }

            // teleport in front of next blocker on y axis
            guard.y = nn;
        } else {
            nn = getNext(map.rows.get(guard.y), guard.x, direction.x);

            if (nn === null) {
                // Left the map on x-axis
                return false;
            }

            // teleport in front of next blocker on x axis
            guard.x = nn;
        }

        if (loopMap.has(`${guard.toString()}-${direction.toString()}`)) {
            return true;
        }

        loopMap.add(`${guard.toString()}-${direction.toString()}`);

        direction.rotate(90, "deg");
    }
}

function getNext(haystack: number[] | null, cur: number, direction: number): number | null {
    if (haystack === null || haystack === undefined) {
        return null;
    }

    const options = haystack.filter((n) => {
        return direction > 0 ? n > cur : n < cur;
    });

    if (options.length === 0) {
        return null;
    }

    if (direction > 0) {
        return options.shift() - direction;
    }

    return options.pop() - direction;
}

function buildAbstractMap(grid: Grid2D<string>): AbstractMap {
    const rows = new Map<number, number[]>();
    const columns = new Map<number, number[]>();
    const start = new Vec2();

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === BLOCKER) {
                if (!rows.has(y)) {
                    rows.set(y, []);
                }

                if (!columns.has(x)) {
                    columns.set(x, []);
                }

                rows.get(y).push(x);
                columns.get(x).push(y);
            } else if (grid[y][x] === GUARD) {
                start.x = x;
                start.y = y;
            }
        }
    }

    return {
        rows,
        columns,
        start,
    };
}
