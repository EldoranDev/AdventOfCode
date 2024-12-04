import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const listA: number[] = [];
    const listB: number[] = [];

    for (let i = 0; i < input.length; i++) {
        const [a, b] = input[i].split("   ");

        listA.push(Number(a));
        listB.push(Number(b));
    }

    listA.sort();
    listB.sort();

    let diff = 0;

    for (let i = 0; i < listA.length; i++) {
        diff += Math.abs(listA[i] - listB[i]);
    }

    return diff;
}
