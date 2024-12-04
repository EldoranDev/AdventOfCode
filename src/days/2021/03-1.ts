import {} from "@lib/input";
import { Context } from "@app/types";
import { create } from "@lib/array2d";

export default function (input: string[], { logger }: Context) {
    const numbers: string[][] = create(0, input[0].length);

    for (const line of input) {
        for (let i = 0; i < line.length; i++) {
            logger.debug(line.charAt(i));
            numbers[i].push(line.charAt(i));
        }
    }

    let gammaIn = "";
    let epsilonIn = "";

    for (let i = 0; i < numbers.length; i++) {
        const ones = numbers[i].filter((n) => n === "1").length;

        if (ones > numbers[i].length / 2) {
            epsilonIn += "0";
            gammaIn += "1";
        } else {
            epsilonIn += "1";
            gammaIn += "0";
        }
    }

    logger.debug(epsilonIn);
    logger.debug(gammaIn);
    const gamma = parseInt(gammaIn, 2);
    const epsilon = parseInt(epsilonIn, 2);

    return gamma * epsilon;
}
