import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec3 } from "@lib/math";

const START = new Vec3(0, 0, 0);

// Vec 3
// X Y Z
// Q R S

const DIRS = {
    n: new Vec3(0, -1, 1),
    ne: new Vec3(+1, -1, 0),
    se: new Vec3(+1, 0, -1),
    s: new Vec3(0, +1, -1),
    sw: new Vec3(-1, +1, 0),
    nw: new Vec3(-1, 0, +1),
};

export default function (input: string[], { logger }: Context) {
    const dirs = input[0].split(",");

    const pos = START.clone();

    let furthest = 0;

    for (const dir of dirs) {
        pos.add(DIRS[dir]);

        const cur = pos.manhattan(START);

        if (cur > furthest) {
            furthest = cur;
        }
    }

    return furthest / 2;
}
