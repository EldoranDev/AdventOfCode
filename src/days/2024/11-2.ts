import {} from "@lib/input";
import { Context } from "@app/types";
import { sum } from "@lib/math/functions";
import { memoize } from "@lib/functools";

const BLINKS = 75;

export default function ([line]: string[], { logger }: Context) {
    const stones = line.split(" ").map(Number);

    return sum(...stones.map((s) => memBlink(s, BLINKS)));
}

function blink(stone: number, blinks: number): number {
    if (blinks === 0) {
        return 1;
    }

    if (stone === 0) {
        return memBlink(1, blinks - 1);
    }

    const str = stone.toString();
    if (str.length % 2 === 0) {
        return (
            memBlink(Number(str.slice(0, str.length / 2)), blinks - 1) +
            memBlink(Number(str.slice(str.length / 2, str.length)), blinks - 1)
        );
    }

    return memBlink(stone * 2024, blinks - 1);
}

const memBlink = memoize(blink);
