import { getLineGroups } from "@lib/input";
import { sum } from "@lib/math/functions";

export default function (input: string[]) {
    const elves = getLineGroups(input);
    const calories: number[] = [];

    for (let i = 0; i < elves.length; i++) {
        calories[i] = sum(...elves[i].map((s) => Number(s)));
    }

    return calories.sort((a, b) => b - a)[0];
}
