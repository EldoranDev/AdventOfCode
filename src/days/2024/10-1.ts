import {} from "@lib/input";
import { Context } from "@app/types";
import { Grid2D } from "@lib/array2d";
import { Vec2 } from "@lib/math";
import { sum } from "@lib/math/functions";

export default function (input: string[], { logger }: Context) {
    const map: Grid2D<number> = input.map((line) => line.split("").map(Number));

    const trailheads = findTrailHeads(map);

    return sum(...trailheads.map((pos) => getScore(pos, 0, new Set<string>(), map)));
}

function getScore(
    position: Vec2,
    height: number,
    visited: Set<string>,
    map: Grid2D<number>,
): number {
    visited.add(position.toString());

    if (height === 9) {
        return 1;
    }

    let score = 0;

    // Check in every direction (without diagonals)
    for (const dir of Vec2.ULRD) {
        const np = Vec2.add(position, dir);

        if (np.y < 0 || np.y >= map.length || np.x < 0 || np.x > map[np.y].length) {
            continue;
        }

        if (map[np.y][np.x] !== height + 1 || visited.has(np.toString())) {
            continue;
        }

        score += getScore(np, height + 1, visited, map);
    }

    return score;
}

function findTrailHeads(map: Grid2D<number>): Vec2[] {
    const heads: Vec2[] = [];

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 0) {
                heads.push(new Vec2(x, y));
            }
        }
    }

    return heads;
}
