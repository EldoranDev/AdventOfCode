import { getLineGroups } from "@lib/input";
import { sum } from "@lib/math/functions";

export default function (input: string[]) {
    const elves = getLineGroups(input);

    let calories: number[] = [];

    for (let i = 0; i < elves.length; i++) {
        calories[i] = sum(...elves[i].map((s) => Number(s)));
    }

    calories = calories.sort((a, b) => b - a);

    let s = 0;

    for (let i = 0; i < 3; i++) {
        s += calories[i];
    }

    return s;
}
