import {} from "@lib/input";
import { Context } from "@app/types";

const GEAR = /\*/;
const NUM = /\d/;

const nums = new Map<string, string>();
const gears = new Map<string, number[]>();

export default function (input: string[], { logger }: Context) {
    for (let y = 0; y < input.length; y++) {
        let num = "";
        for (let x = 0; x < input[y].length; x++) {
            if (NUM.test(input[y][x])) {
                num += input[y][x];
            } else if (num !== "") {
                nums.set(`${x - num.length},${y}`, num);
                num = "";
            }

            const isGear = GEAR.test(input[y][x]);

            if (isGear) {
                gears.set(`${x},${y}`, []);
            }
        }

        if (num !== "") {
            nums.set(`${input[y].length - num.length},${y}`, num);
            num = "";
        }
    }

    Array.from(nums.entries()).forEach(([key, value]) => {
        const [x, y] = key.split(",").map((v) => parseInt(v, 10));

        return addToGears(x, y, value);
    });

    return Array.from(gears.values())
        .filter((gear) => gear.length === 2)
        .reduce((acc, gear) => acc + gear[0] * gear[1], 0);
}

function addToGears(x: number, y: number, num: string): void {
    const candidates = [
        [x - 1, y],
        [x + num.length, y],
    ];

    for (let xx = x - 1; xx < x + num.length + 1; xx++) {
        candidates.push([xx, y - 1]);
        candidates.push([xx, y + 1]);
    }

    for (const [xx, yy] of candidates) {
        if (gears.has(`${xx},${yy}`)) {
            gears.get(`${xx},${yy}`).push(parseInt(num, 10));
        }
    }
}
