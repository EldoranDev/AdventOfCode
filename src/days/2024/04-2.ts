import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

const CROSS = {
    ltr: [new Vec2(-1, -1), new Vec2(0, 0), new Vec2(1, 1)],
    rtl: [new Vec2(1, -1), new Vec2(0, 0), new Vec2(-1, 1)],
};

const MAS = "MAS";
const SAM = "SAM";

export default function (input: string[], { logger }: Context) {
    let count = 0;

    for (let y = 0; y < input.length; y++) {
        let x = input[y].indexOf(MAS[1]);

        while (x !== -1) {
            if (check(new Vec2(x, y), input)) {
                count++;
            }

            x = input[y].indexOf(MAS[1], x + 1);
        }
    }

    return count;
}

function check(pos: Vec2, grid: string[]): boolean {
    // No space for an X on the border As
    // if we check here, validation further down can get skipped
    if (
        pos.x === 0 ||
        pos.y === 0 ||
        pos.y === grid.length - 1 ||
        pos.x === grid[pos.y].length - 1
    ) {
        return false;
    }

    const ltr = CROSS.ltr
        .map((p) => {
            const pp = Vec2.add(pos, p);

            return grid[pp.y][pp.x];
        })
        .join("");

    const rtl = CROSS.rtl
        .map((p) => {
            const pp = Vec2.add(pos, p);

            return grid[pp.y][pp.x];
        })
        .join("");

    return (ltr === MAS || ltr === SAM) && (rtl === MAS || rtl === SAM);
}
