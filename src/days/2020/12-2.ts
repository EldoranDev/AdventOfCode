import {} from "@lib/input";
import { Vec2 } from "@lib/math";

export default function (input: string[]) {
    type Ship = { pos: Vec2; wp: Vec2 };

    const ship: Ship = {
        pos: new Vec2(),
        wp: new Vec2(10, 1),
    };

    for (const line of input) {
        const amount = Number(line.substring(1));

        switch (line.charAt(0)) {
            case "N":
                ship.wp.add(Vec2.mult(Vec2.UP, amount));
                break;
            case "S":
                ship.wp.add(Vec2.mult(Vec2.DOWN, amount));
                break;
            case "E":
                ship.wp.add(Vec2.mult(Vec2.RIGHT, amount));
                break;
            case "W":
                ship.wp.add(Vec2.mult(Vec2.LEFT, amount));
                break;
            case "L":
                ship.wp.rotate(amount);
                break;
            case "R":
                ship.wp.rotate(-amount);
                break;
            case "F":
                ship.pos.add(Vec2.mult(ship.wp, amount));
                break;
        }
    }

    return ship.pos.manhattan(Vec2.ZERO);
}
