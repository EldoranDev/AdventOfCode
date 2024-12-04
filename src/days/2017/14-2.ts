import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";
import { knot } from "./hash/knot";

type Map = string[][];

export default function (input: string[], { logger }: Context) {
    const map: Map = [];

    let count = 0;

    for (let i = 0; i < 128; i++) {
        const hash = knot(`${input[0]}-${i}`);

        map[i] = hash.asBinary().split("");
    }

    for (;;) {
        const next = getNext(map);

        if (next === null) {
            break;
        }

        count++;

        const open = [next];

        while (open.length > 0) {
            const pos = open.pop();

            map[pos.y][pos.x] = "0";

            for (const dir of Vec2.ULRD) {
                const np = Vec2.add(pos, dir);

                if (np.x < 0 || np.x > 127 || np.y < 0 || np.y > 127) {
                    continue;
                }

                if (map[np.y][np.x] === "1") {
                    open.push(np);
                }
            }
        }
    }

    return count;
}

function getNext(array: Map): Vec2 {
    for (let i = 0; i < array.length; i++) {
        const index = array[i].indexOf("1");

        if (index !== -1) {
            return new Vec2(index, i);
        }
    }

    return null;
}
