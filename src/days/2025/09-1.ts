import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

export default function (input: string[], { logger }: Context) {
    const tiles: Array<Vec2> = input.map((l) => {
        const [x, y] = l.split(",").map(Number);
        return new Vec2(x, y);
    });

    let biggest = 0;

    for (let i = 0; i < tiles.length; i++) {
        const a = tiles[i];
        for (let j = i + 1; j < tiles.length; j++) {
            const b = tiles[j];

            const x = Math.abs(a.x - b.x) + 1;
            const y = Math.abs(a.y - b.y) + 1;

            const A = x * y;

            if (A > biggest) {
                biggest = A;
            }
        }
    }

    return biggest;
}
