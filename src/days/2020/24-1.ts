import {} from "@lib/input";
import { Vec3 } from "@lib/math";
import { Convay } from "@lib/simulation";

export default function (input: string[]) {
    const instructions: string[][] = [];

    for (const line of input) {
        const tile: string[] = [];
        const inst: string[] = line.split("");
        let current = "";

        for (let i = 0; i < inst.length; i++) {
            current += inst[i];

            if (current.includes("e") || current.includes("w")) {
                tile.push(current);
                current = "";
            }
        }

        instructions.push(tile);
    }

    const convay = new Convay<Vec3>(
        (pos) =>
            [
                new Vec3(-1, +1, 0),
                new Vec3(+1, -1, 0),
                new Vec3(-1, 0, +1),
                new Vec3(0, -1, +1),
                new Vec3(0, +1, -1),
                new Vec3(+1, 0, -1),
            ].map((offset) => Vec3.add(pos, offset)),
        (neighbors) => neighbors > 0 && neighbors <= 2,
        (neighbors) => neighbors === 2,
    );

    for (const tile of instructions) {
        const position: Vec3 = new Vec3(0, 0, 0);

        for (const move of tile) {
            switch (move) {
                case "w":
                    position.add(new Vec3(-1, +1, 0));
                    break;
                case "e":
                    position.add(new Vec3(+1, -1, 0));
                    break;
                case "sw":
                    position.add(new Vec3(-1, 0, +1));
                    break;
                case "se":
                    position.add(new Vec3(0, -1, +1));
                    break;
                case "nw":
                    position.add(new Vec3(0, +1, -1));
                    break;
                case "ne":
                    position.add(new Vec3(+1, 0, -1));
                    break;
            }
        }

        convay.set(position, !convay.getStateOfField(position));
    }

    return convay.getActiveCount();
}
