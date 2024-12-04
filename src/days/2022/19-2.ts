/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import {} from "@lib/input";
import { Context } from "@app/types";

const E =
    /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian/;

enum Resource {
    ORE = 0,
    CLAY = 1,
    OBSIDIAN = 2,
    GEODE = 3,
}

interface Recipe {
    output: Resource;
    input: Storage;
}

interface Blueprint {
    id: number;
    recipes: Array<Recipe>;
    max: Storage;
}

const TIME = 32;
const BPS: Array<Blueprint> = [];

export default function (input: string[], { logger }: Context) {
    for (let i = 0; i < 3 && i < input.length; i++) {
        const [, id, oreOre, clayOre, obsOre, obsClay, geoOre, geoObsidian] = E.exec(input[i]).map(
            (h) => Number(h),
        );

        BPS.push({
            id,
            recipes: [
                { output: Resource.ORE, input: [oreOre, 0, 0, 0] },
                { output: Resource.CLAY, input: [clayOre, 0, 0, 0] },
                { output: Resource.OBSIDIAN, input: [obsOre, obsClay, 0, 0] },
                { output: Resource.GEODE, input: [geoOre, 0, geoObsidian, 0] },
            ],
            max: [
                Math.max(oreOre, clayOre, obsOre, geoOre),
                obsClay,
                geoObsidian,
                Number.MAX_SAFE_INTEGER,
            ],
        });
    }

    let s = 1;
    for (let i = 0; i < BPS.length; i++) {
        s *= getQualityLevel(i, 1, [1, 0, 0, 0], [0, 0, 0, 0]);
    }
    return s;
}

type Robots = [number, number, number, number];
type Storage = [number, number, number, number];

const RR = [Resource.ORE, Resource.CLAY, Resource.OBSIDIAN, Resource.GEODE];

const MAX = new Map<number, number>();

function getQualityLevel(bp: number, time: number, robots: Robots, storage: Storage): number {
    // Reached the end so return the current amount
    if (time === TIME + 1) {
        if (!MAX.has(bp)) {
            MAX.set(bp, 0);
        }

        const val = storage[Resource.GEODE];

        if (MAX.get(bp) < val) {
            MAX.set(bp, val);
        }

        return val;
    }

    const s = sum(storage[Resource.GEODE] + (TIME - time));

    if (MAX.has(bp) && storage[Resource.GEODE] + s < MAX.get(bp)) {
        // return bp;
    }

    const candidates: Array<number> = [];

    // Check what recipes can be done in time and with the current robots
    const possibleRecipes = BPS[bp].recipes.filter((recipe) => {
        for (const rr of RR) {
            if (recipe.input[rr] > 0 && robots[rr] === 0) {
                return false;
            }
        }

        return true;
    });

    // check candidates
    for (const recipe of possibleRecipes) {
        let rounds = 0;

        if (robots[recipe.output] + 1 > BPS[bp].max[recipe.output]) {
            continue;
        }

        for (const rr of RR) {
            if (recipe.input[rr] === 0) {
                continue;
            }

            const required = recipe.input[rr] - storage[rr];
            const reqRounds = Math.ceil(required / robots[rr]);

            rounds = Math.max(reqRounds, rounds);
        }

        if (time + rounds + 1 > TIME) {
            continue;
        }

        const newStroage: Storage = [...storage];
        const newBots: Robots = [...robots];

        for (let i = 0; i < rounds; i++) {
            for (const rr of RR) {
                newStroage[rr] += robots[rr];
            }
        }

        rounds += 1;
        for (const rr of RR) {
            newStroage[rr] += robots[rr];
        }

        for (const rr of RR) {
            newStroage[rr] -= recipe.input[rr];
        }

        newBots[recipe.output] += 1;
        candidates.push(getQualityLevel(bp, time + rounds, newBots, newStroage));
    }

    // Candiates found, so we return the greatest of them
    if (candidates.length >= 1) {
        return Math.max(...candidates);
    }

    // No recipe can be done in time aso we simply step through
    for (const rr of RR) {
        storage[rr] += robots[rr];
    }

    return getQualityLevel(bp, time + 1, [...robots], [...storage]);
}

function sum(n: number): number {
    return (n * n + n) / 2;
}
