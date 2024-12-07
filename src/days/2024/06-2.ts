import {} from "@lib/input";
import { Context } from "@app/types";
import { Grid2D } from "@lib/array2d";
import { Vec2 } from "@lib/math";

const INFINITY = 200;

const GUARD = "^";
const BLOCKER = "#";

type AbstractMap = { rows: Map<number, number[]>; columns: Map<number, number[]>; start: Vec2 };

export default function (input: string[], { logger }: Context) {
    const grid: Grid2D<string> = input.map((line) => line.split(""));
    const map = buildAbstractMap(grid);

    let loops = 0;

    for (const [poi, [start, dir]] of getPOI(grid, map.start)) {
        if (poi.equals(map.start)) {
            continue;
        }

        if (!map.rows.has(poi.y)) {
            map.rows.set(poi.y, []);
        }

        if (!map.columns.has(poi.x)) {
            map.columns.set(poi.x, []);
        }

        const row = map.rows.get(poi.y);
        const col = map.columns.get(poi.x);

        row.push(poi.x);
        col.push(poi.y);

        row.sort((a, b) => a - b);
        col.sort((a, b) => a - b);

        if (hasLoop(map, start, dir)) {
            loops++;
        }

        row.splice(row.indexOf(poi.x), 1);
        col.splice(col.indexOf(poi.y), 1);
    }

    return loops;
}

function* getPOI(grid: Grid2D<string>, start: Vec2): Generator<[Vec2, [Vec2, Vec2]]> {
    let guard = start.clone();

    const direction = new Vec2(0, -1);
    const set = new Set<string>();

    for (;;) {
        const np = Vec2.add(guard, direction);

        if (grid[np.y][np.x] !== BLOCKER) {
            if (!set.has(np.toString())) {
                set.add(np.toString());
                yield [np.clone(), [guard.clone(), direction.clone()]];
            }

            if (np.x < 0 || np.y < 0 || np.y >= grid.length || np.x >= grid[np.y].length) {
                break;
            }

            guard = np;
        } else {
            direction.rotate(90, "deg");
        }
    }
}

function hasLoop(map: AbstractMap, start: Vec2, dir: Vec2): boolean {
    const guard = start.clone();
    const direction = dir.clone();

    let nn: number | null = null;

    for (let i = 0; i < INFINITY; i++) {
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

        direction.rotate(90, "deg");
    }

    return true;
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
