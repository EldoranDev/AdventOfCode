import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

interface Maschine {
    a: Vec2;
    b: Vec2;
    price: Vec2;
}

const RX_BUTTON = /.*X([+-]\d+), Y([+-]\d+)/;
const RX_PRIZE = /.*X=(\d+), Y=(\d+)/;

export default function (input: string[], { logger }: Context) {
    const maschines: Maschine[] = getLineGroups(input).map((def) => {
        const [, ax, ay] = RX_BUTTON.exec(def[0]);
        const [, bx, by] = RX_BUTTON.exec(def[1]);
        const [, px, py] = RX_PRIZE.exec(def[2]);

        return {
            a: new Vec2(Number(ax), Number(ay)),
            b: new Vec2(Number(bx), Number(by)),
            price: new Vec2(Number(px), Number(py)),
        };
    });

    let sum = 0;

    for (const maschine of maschines) {
        const a = maschine.a.x;
        const b = maschine.a.y;

        maschine.a.x *= b;
        maschine.b.x *= b;
        maschine.price.x *= b;

        maschine.a.y *= a;
        maschine.b.y *= a;
        maschine.price.y *= a;

        const p = maschine.price.y - maschine.price.x;
        const y = maschine.b.y - maschine.b.x;

        const countB = p / y;

        if (countB !== (countB | 0)) {
            continue;
        }

        const countA = (maschine.price.x - maschine.b.x * countB) / maschine.a.x;

        sum += countA * 3 + countB;
    }

    return sum;
}
