import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

const POLY: Array<Vec2> = [];

export default function (input: string[], { logger }: Context) {
    input.forEach((l) => {
        const [x, y] = l.split(",").map(Number);

        POLY.push(new Vec2(x, y));
    });

    let biggest = 0;

    for (let i = 0; i < POLY.length; i++) {
        const a = POLY[i];
        for (let j = i + 1; j < POLY.length; j++) {
            const b = POLY[j];

            const x = Math.abs(a.x - b.x) + 1;
            const y = Math.abs(a.y - b.y) + 1;

            const A = x * y;

            if (A > biggest && checkPoints(a, b)) {
                biggest = A;
            }
        }
    }

    return biggest;
}

function checkPoints(a: Vec2, b: Vec2): boolean {
    const xmin = Math.min(a.x, b.x);
    const xmax = Math.max(a.x, b.x);
    const ymin = Math.min(a.y, b.y);
    const ymax = Math.max(a.y, b.y);

    for (let i = 0; i < POLY.length; i++) {
        const [x1, y1] = POLY[i].toArray();
        const [x2, y2] = POLY[(i + 1) % POLY.length].toArray();

        if (y1 === y2) {
            if (
                ymin < y1 &&
                y1 < ymax &&
                ((Math.min(x1, x2) <= xmin && xmin < Math.max(x1, x2)) ||
                    (Math.min(x1, x2) < xmax && xmax <= Math.max(x1, x2)))
            ) {
                return false;
            }
        } else if (x1 === x2) {
            if (
                xmin < x1 &&
                x1 < xmax &&
                ((Math.min(y1, y2) <= ymin && ymin < Math.max(y1, y2)) ||
                    (Math.min(y1, y2) < ymax && ymax <= Math.max(y1, y2)))
            ) {
                return false;
            }
        } else {
            console.error("WTF?! Polygon is not rectilinear");
            return false;
        }
    }

    return true;
}
