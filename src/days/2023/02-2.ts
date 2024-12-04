import {} from "@lib/input";
import { Context } from "@app/types";

type Limit = [number, number, number];
type Game = {
    id: number;
    cubes: Limit;
    power: number;
};

const INDEX = {
    red: 0,
    green: 1,
    blue: 2,
};

export default function (input: string[], { logger }: Context) {
    return input
        .map((line): Game => {
            const [, id, sets] = /Game (\d+): (.*)/.exec(line);

            const max = getMaxFromSets(sets);

            return {
                id: parseInt(id, 10),
                cubes: getMaxFromSets(sets),
                power: max.reduce((acc, val) => acc * val, 1),
            };
        })
        .reduce((acc, game) => acc + game.power, 0);
}

function getMaxFromSets(sets: string): Limit {
    const max = new Map<string, number>();

    sets.split(";").forEach((set: string) => {
        for (const col of set.trim().split(",")) {
            const [count, color] = col.trim().split(" ");

            if (!max.has(color) || max.get(color) < parseInt(count, 10)) {
                max.set(color, parseInt(count, 10));
            }
        }
    });

    const ret: Limit = [0, 0, 0];
    max.forEach((value, key) => {
        ret[INDEX[key]] = value;
    });

    return ret;
}
