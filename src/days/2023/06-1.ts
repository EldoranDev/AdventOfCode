import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const times = input[0]
        .split(":")[1]
        .trim()
        .split(" ")
        .filter((x) => x !== "")
        .map(Number);
    const distances = input[1]
        .split(":")[1]
        .trim()
        .split(" ")
        .filter((x) => x !== "")
        .map(Number);
    const winner = times.map(() => 0);

    for (let race = 0; race < times.length; race++) {
        for (let i = 0; i < times[race]; i++) {
            if (i * (times[race] - i) > distances[race]) {
                winner[race]++;
            }
        }
    }

    return winner.reduce((prev, curr) => prev * curr, 1);
}
