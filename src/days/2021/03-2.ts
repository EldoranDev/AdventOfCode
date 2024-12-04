import {} from "@lib/input";
import { Context } from "@app/types";
import { create } from "@lib/array2d";

export default function (input: string[], { logger }: Context) {
    let search = [...input];
    let position = 0;

    while (search.length > 1) {
        const ones = search.filter((l) => l.charAt(position) === "1").length;

        if (ones >= search.length / 2) {
            logger.debug(`${ones} >= ${search.length}`);
            search = search.filter((l) => l.charAt(position) === "1");
        } else {
            search = search.filter((l) => l.charAt(position) === "0");
        }

        position++;
    }

    const gen = parseInt(search[0], 2);

    search = [...input];
    position = 0;

    while (search.length > 1) {
        const ones = search.filter((l) => l.charAt(position) === "1").length;

        if (ones >= search.length / 2) {
            logger.debug(`${ones} > ${search.length}`);
            search = search.filter((l) => l.charAt(position) === "0");
        } else {
            search = search.filter((l) => l.charAt(position) === "1");
        }

        position++;
    }

    const scrubber = parseInt(search[0], 2);

    return gen * scrubber;
}
