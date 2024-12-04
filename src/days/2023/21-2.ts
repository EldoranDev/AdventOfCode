import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { Grid2D, create } from "@lib/array2d";

let MAP: Grid2D<string> = null;

const STEPS = 26501365;

const DIRS = [new Vec2(1, 0), new Vec2(0, 1), new Vec2(-1, 0), new Vec2(0, -1)];

export default function (input: string[], { logger }: Context) {
    MAP = create<string>(input[0].length, input.length, ".");
    let start: Vec2 = null;

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] === "S") {
                start = new Vec2(x, y);
                MAP[y][x] = ".";
                continue;
            }

            MAP[y][x] = input[y][x];
        }
    }

    const SIZE = MAP.length;

    // Assertions over the input
    // Taken from HyperNeutrino on YouTube
    // https://www.youtube.com/watch?v=9UOMZSL0JTg

    if (start.x !== start.y || start.x !== ((SIZE / 2) | 0)) {
        console.log(start.x, start.y, SIZE / 2);
        throw new Error("Parsing Error: Start is not in the middle of the map");
    }

    if (STEPS % SIZE !== ((SIZE / 2) | 0)) {
        console.log(STEPS % SIZE, (SIZE / 2) | 0);
        throw new Error("Parsing Error: Steps is not a multiple of the map size");
    }

    const GRID_WITH = ((STEPS / SIZE) | 0) - 1;

    // Get number ob odd grid cells in the initie grid
    const odd = (floorDiv(GRID_WITH, 2) * 2 + 1) ** 2;
    const even = (floorDiv(GRID_WITH + 1, 2) * 2) ** 2;

    const oddPoints = getReachable(start.clone(), SIZE * 2 + 1);
    const evenPoints = getReachable(start.clone(), SIZE * 2);

    // Number of reachable points of the grid cells in the fully reachable grids
    const inside = oddPoints * odd + evenPoints * even;

    // Get the number or the Edges

    const corners = [
        new Vec2(start.x, SIZE - 1),
        new Vec2(SIZE - 1, start.y),
        new Vec2(0, start.y),
        new Vec2(start.x, 0),
    ]
        .map((pp) => getReachable(pp, SIZE - 1))
        .reduce((a, b) => a + b, 0);

    const smallCorners =
        [new Vec2(0, SIZE - 1), new Vec2(SIZE - 1, 0), new Vec2(SIZE - 1, SIZE - 1), new Vec2(0, 0)]
            .map((pp) => getReachable(pp, floorDiv(SIZE, 2) - 1))
            .reduce((a, b) => a + b, 0) *
        (GRID_WITH + 1);

    const largeConers =
        [new Vec2(0, SIZE - 1), new Vec2(SIZE - 1, 0), new Vec2(SIZE - 1, SIZE - 1), new Vec2(0, 0)]
            .map((pp) => getReachable(pp, floorDiv(SIZE * 3, 2) - 1))
            .reduce((a, b) => a + b, 0) * GRID_WITH;

    return inside + corners + smallCorners + largeConers;
}

// Iterative BFS rewrite of the recursive solution from P1
// This allows to reuse the same function more easily
function getReachable(pos: Vec2, steps: number): number {
    const queue: Array<[Vec2, number]> = [[pos, steps]];
    const seen = new Set<string>();

    const answer = new Set<string>();

    while (queue.length > 0) {
        const [p, s] = queue.shift();

        if (s % 2 === 0) {
            answer.add(p.toString());
        }

        if (s === 0) {
            continue;
        }

        for (const neighbor of DIRS) {
            const np = Vec2.add(p, neighbor);

            if (
                np.x < 0 ||
                np.y < 0 ||
                np.x >= MAP[0].length ||
                np.y >= MAP.length ||
                seen.has(np.toString())
            ) {
                continue;
            }

            if (MAP[np.y][np.x] === "#") {
                continue;
            }

            seen.add(np.toString());
            queue.push([np, s - 1]);
        }
    }

    return answer.size;
}

function floorDiv(a: number, b: number) {
    return Math.floor(a / b);
}
