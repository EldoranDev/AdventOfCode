import { Context } from "@app/types";
import { sum } from "@lib/math/functions";

let COMBINATIONS = new Set<string>();

const SEEN_CACHE = new Set<string>();

const TARGET = 150;

type Container = {
    size: number;
    id: number;
};

let cacheCount = 0;

let MIN = Number.MAX_SAFE_INTEGER;

export default function (input: string[], { logger }: Context) {
    const containers: Array<Container> = [];

    for (let i = 0; i < input.length; i++) {
        containers.push({
            size: Number(input[i]),
            id: i,
        });
    }

    addContainer([], [...containers]);

    console.log(`Cache Hits: ${cacheCount}`);

    return COMBINATIONS.size;
}

function addContainer(fridge: Array<Container>, containers: Array<Container>): void {
    const currentSum = sum(...fridge.map((c) => c.size));

    const fridgeKey = fridge
        .map((c) => c.id)
        .sort()
        .join("-");

    if (currentSum === TARGET) {
        if (fridge.length < MIN) {
            console.log(`New Min: ${fridge.length}`);
            COMBINATIONS = new Set<string>();
        }

        MIN = fridge.length;

        COMBINATIONS.add(fridgeKey);
        return;
    }

    if (fridge.length + 1 > MIN) {
        return;
    }

    const containerKey = containers
        .map((c) => c.id)
        .sort()
        .join("-");

    const cacheKey = `${fridgeKey}|${containerKey}`;

    if (SEEN_CACHE.has(cacheKey)) {
        cacheCount++;
        return;
    }

    SEEN_CACHE.add(cacheKey);

    for (let i = 0; i < containers.length; i++) {
        if (currentSum + containers[i].size <= TARGET) {
            const newContainers = [...containers];
            newContainers.splice(i, 1);
            addContainer([...fridge, containers[i]], newContainers);
        }
    }
}
