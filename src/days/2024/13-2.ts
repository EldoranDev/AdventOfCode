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
    const machines: Maschine[] = getLineGroups(input).map((def) => {
        const [, ax, ay] = RX_BUTTON.exec(def[0]);
        const [, bx, by] = RX_BUTTON.exec(def[1]);
        const [, px, py] = RX_PRIZE.exec(def[2]);

        return {
            a: new Vec2(Number(ax), Number(ay)),
            b: new Vec2(Number(bx), Number(by)),
            price: new Vec2(Number(px) + 10000000000000, Number(py) + 10000000000000),
        };
    });

    let sum = 0;

    for (const machine of machines) {
        const x =
            (machine.price.x * machine.b.y - machine.b.x * machine.price.y) /
            (machine.a.x * machine.b.y - machine.b.x * machine.a.y);
        const y =
            (machine.a.x * machine.price.y - machine.price.x * machine.a.y) /
            (machine.a.x * machine.b.y - machine.b.x * machine.a.y);

        if (x % 1 !== 0 || y % 1 !== 0) {
            continue;
        }

        sum += x * 3 + y;
    }

    return sum;
}
