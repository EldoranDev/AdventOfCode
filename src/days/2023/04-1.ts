import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    return input
        .map((line) => {
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

            const count = have.filter((n) => winning.has(n)).length - 1;

            return count >= 0 ? 2 ** count : 0;
        })
        .reduce((acc, worth) => acc + worth, 0);
}
