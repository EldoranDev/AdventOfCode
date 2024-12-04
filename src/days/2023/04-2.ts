import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const result = new Map<string, number>();

    for (let i = 0; i < input.length; i++) {
        result.set(i.toString(), 1);
    }

    for (let card = 0; card < input.length; card++) {
        const line = input[card];

        const [, numbers] = line.split(": ");
        const [haveStr, winningStr] = numbers.trim().split("|");

        const have = haveStr
            .split(" ")
            .filter((n) => n.trim() !== "")
            .map((n) => parseInt(n.trim(), 10));
        const winning = new Set(
            winningStr
                .split(" ")
                .filter((n) => n.trim() !== "")
                .map((n) => parseInt(n.trim(), 10)),
        );

        const count = have.filter((n) => winning.has(n)).length;

        const times = result.get(card.toString());

        for (let i = 0; i < count; i++) {
            const reward = card + i + 1;
            if (reward >= input.length) {
                break;
            }
            const current = result.get(reward.toString());

            result.set(reward.toString(), current + times);
        }
    }

    return Array.from(result.values()).reduce((acc, count) => acc + count, 0);
}
