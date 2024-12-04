import { mapToNumber } from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const positions = mapToNumber(input[0].split(","));

    let usedFuel = 99999999999999;
    let position = -1;

    const min = Math.min(...positions);
    const max = Math.max(...positions);

    logger.debug(min);
    logger.debug(max);
    for (let i = min; i < max; i++) {
        let fuel = 0;

        for (let j = 0; j < positions.length; j++) {
            fuel += Math.abs(i - positions[j]);
        }

        logger.debug(fuel);
        if (fuel < usedFuel) {
            position = i;
            usedFuel = fuel;
        }
    }

    return usedFuel;
}
