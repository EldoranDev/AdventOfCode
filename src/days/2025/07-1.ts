import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec2 } from "@lib/math";

export default function (input: string[], { logger }: Context) {
    const map = input.map((l) => l.split(""));

    const beams: Vec2[] = [];

    beams.push(new Vec2(map[0].indexOf("S"), 0));

    map[0][beams[0].x] = ".";

    let count = 0;

    while (beams.length > 0) {
        const beam = beams.shift();

        let cont = true;

        while (cont) {
            if (beam.y >= map.length || beam.x < 0 || beam.x >= map[beam.y].length) {
                break;
            }

            switch (map[beam.y][beam.x]) {
                case ".":
                    map[beam.y][beam.x] = "|";

                    beam.add(new Vec2(0, 1));
                    break;
                case "|":
                    cont = false;
                    break;
                case "^":
                    beams.push(new Vec2(beam.x - 1, beam.y), new Vec2(beam.x + 1, beam.y));

                    count++;
                    cont = false;
                    break;
            }
        }
    }

    return count;
}
