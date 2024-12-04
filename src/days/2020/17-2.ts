import {} from "@lib/input";
import { Vec4 } from "@lib/math";
import { Convay } from "@lib/simulation";

const ROUNDS = 6;
type Map = boolean[][][][];

export default function (input: string[]) {
    const world: Map = [];
    const SIZE = input.length + ROUNDS * 2;

    const neighbors = [];

    for (let z = -1; z <= 1; z++) {
        for (let w = -1; w <= 1; w++) {
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if (!(z === w && w === y && y === x && x === 0)) {
                        neighbors.push(new Vec4(x, y, z, w));
                    }
                }
            }
        }
    }

    const convay = new Convay<Vec4>(
        (pos) => neighbors.map((n) => Vec4.add(pos, n)),
        (count) => count === 2 || count === 3,
        (count) => count === 3,
    );

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input.length; x++) {
            convay.set(new Vec4(x, y, 0, 0), input[y].charAt(x) === "#");
        }
    }

    for (let round = 0; round < ROUNDS; round++) {
        convay.tick();
    }

    return convay.getActiveCount();
}

function print(world: Map): void {
    for (let z = 0; z < world.length; z++) {
        console.log(`z=${z}`);

        for (let y = 0; y < world[z].length; y++) {
            for (let x = 0; x < world[z][y].length; x++) {
                process.stdout.write(world[z][y][x] ? "#" : ".");
            }

            process.stdout.write("\n");
        }
    }
}
