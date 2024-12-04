import {} from "@lib/input";
import { Context } from "@app/types";
import { sum } from "@lib/math/functions";

type Property = {
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
};

const INGREDIENTS: Array<Property> = [];

const EXTRACTOR =
    /(\w+): capacity (-?\d), durability (-?\d), flavor (-?\d). texture (-?\d), calories (-?\d)/;

const CACHE = new Map<string, number>();

export default function (input: string[], { logger }: Context) {
    for (const line of input) {
        const [, name, capacity, durability, flavor, texture, calories] = EXTRACTOR.exec(line)!;
        INGREDIENTS.push({
            capacity: Number(capacity),
            durability: Number(durability),
            flavor: Number(flavor),
            texture: Number(texture),
            calories: Number(calories),
        });
    }

    return addIngredient(Array.from({ length: INGREDIENTS.length }, () => 0));
}

function addIngredient(ingredients: Array<number>): number {
    const cacheKey = ingredients.join(",");

    if (sum(...ingredients) === 100) {
        let capacity = 0;
        let durability = 0;
        let flavor = 0;
        let texture = 0;
        let calories = 0;

        for (let i = 0; i < ingredients.length; i++) {
            capacity += ingredients[i] * INGREDIENTS[i].capacity;
            durability += ingredients[i] * INGREDIENTS[i].durability;
            flavor += ingredients[i] * INGREDIENTS[i].flavor;
            texture += ingredients[i] * INGREDIENTS[i].texture;
            calories += ingredients[i] * INGREDIENTS[i].calories;
        }

        capacity = Math.max(0, capacity);
        durability = Math.max(0, durability);
        flavor = Math.max(0, flavor);
        texture = Math.max(0, texture);

        let score = capacity * durability * flavor * texture;

        if (calories !== 500) {
            score = 0;
        }

        CACHE.set(cacheKey, score);

        return score;
    }

    if (CACHE.has(cacheKey)) {
        return CACHE.get(cacheKey)!;
    }

    const options = [];

    for (let i = 0; i < ingredients.length; i++) {
        const newIngredients = [...ingredients];
        newIngredients[i]++;

        options.push(addIngredient(newIngredients));
    }

    const highest = Math.max(...options);

    CACHE.set(cacheKey, highest);

    return highest;
}

// 62842880
// 21367368
