import { } from '@lib/input';
import { Context } from '@app/types';

type Path = { target: string, distance: number };

const EXTRACTOR = /([a-zA-Z]*) to ([a-zA-Z]*) = (\d*)/;

type State = {
    current: string;
    open: Set<string>;
    visited: Set<string>;
    distance: number;
};

const MAP = new Map<string, Array<Path>>();
let SHORTEST = Number.MAX_SAFE_INTEGER;

export default function (input: string[], { logger }: Context) {
    for (const line of input) {
        const [, from, to, distance] = EXTRACTOR.exec(line);
        if (!MAP.has(from)) {
            MAP.set(from, []);
        }

        if (!MAP.has(to)) {
            MAP.set(to, []);
        }

        MAP.get(from)!.push({ target: to, distance: Number(distance) });
        MAP.get(to)!.push({ target: from, distance: Number(distance) });
    }

    for (const [from] of MAP.entries()) {
        const state: State = {
            current: from,
            open: new Set([...MAP.keys()].filter((k) => k !== from)),
            visited: new Set(),
            distance: 0,
        };

        getDistance(state);
    }

    return SHORTEST;
}

function getDistance(state: State): number {
    // We've visited all the nodes
    if (state.open.size === 0) {
        // We've found a shorter path
        if (state.distance < SHORTEST) {
            SHORTEST = state.distance;
        }

        return state.distance;
    }

    // We can't possibly get a shorter path than the shortest we've already found
    if (state.distance > SHORTEST) {
        return Number.MAX_SAFE_INTEGER;
    }

    // Get all the possible paths from the current node
    const possible = MAP.get(state.current)!.filter((p) => state.open.has(p.target));

    // We've reached a dead end
    if (possible.length === 0) {
        return Number.MAX_SAFE_INTEGER;
    }

    const distances: Array<number> = [];

    for (const path of possible) {
        distances.push(getDistance(
            {
                current: path.target,
                distance: state.distance + path.distance,
                open: new Set([...state.open.values()].filter((v) => v !== path.target)),
                visited: new Set([...state.visited.values(), path.target]),
            },
        ));
    }

    return Math.min(...distances);
}
