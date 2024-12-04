import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { create, getColumn } from "@lib/array2d";
import { Vec2 } from "@lib/math";
import { Grid2D } from "@lib/array2d/create";

type Bound = { from: number; to: number };

const UP = new Vec2(0, -1);
const DOWN = new Vec2(0, 1);
const LEFT = new Vec2(-1, 0);
const RIGHT = new Vec2(1, 0);

export default function (input: string[], { logger }: Context) {
    const [mapRaw, [instructions]] = getLineGroups(input);

    const map = create<string>(mapRaw[0].length, mapRaw.length);

    const rows: Array<Bound> = Array.from({ length: mapRaw.length });
    const columns: Array<Bound> = Array.from({ length: mapRaw[0].length });

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x] = mapRaw[y][x];
        }
        rows[y] = getBounds(map[y]);
    }

    for (let x = 0; x < map[0].length; x++) {
        const col = getColumn(map, x);
        columns[x] = getBounds(col);
    }

    const pos = new Vec2(rows[0].from, 0);
    const facing = RIGHT.clone();

    let distance: string = "";

    console.log(columns[3]);

    for (let i = 0; i < instructions.length; i++) {
        if (instructions[i] === "L" || instructions[i] === "R") {
            switch (instructions[i]) {
                case "L":
                    facing.rotate(-90, "deg");
                    continue;
                case "R":
                    facing.rotate(90, "deg");
                    continue;
                default:
                    throw new Error("Logic error");
            }
        }

        distance = `${distance}${instructions[i]}`;

        if (
            i + 1 === instructions.length ||
            instructions[i + 1] === "L" ||
            instructions[i + 1] === "R"
        ) {
            const dist = Number(distance);
            distance = "";

            for (let d = 0; d < dist; d++) {
                const newPos = Vec2.add(pos, facing);

                if (facing.equals(LEFT) || facing.equals(RIGHT)) {
                    if (newPos.x < rows[newPos.y].from) {
                        newPos.x = rows[newPos.y].to;
                    }

                    if (newPos.x > rows[newPos.y].to) {
                        newPos.x = rows[newPos.y].from;
                    }
                }

                if (facing.equals(UP) || facing.equals(DOWN)) {
                    if (newPos.y < columns[newPos.x].from) {
                        newPos.y = columns[newPos.x].to;
                    }

                    if (newPos.y > columns[newPos.x].to) {
                        newPos.y = columns[newPos.x].from;
                    }
                }

                if (map[newPos.y][newPos.x] === "#") {
                    break;
                }

                drawFacing(facing, pos, map);

                pos.x = newPos.x;
                pos.y = newPos.y;
            }
        }
    }

    let facingValue = 0;

    if (facing.equals(RIGHT)) {
        facingValue = 0;
    } else if (facing.equals(DOWN)) {
        facingValue = 1;
    } else if (facing.equals(LEFT)) {
        facingValue = 2;
    } else {
        facingValue = 3;
    }

    console.log(map.reduce((prev, current) => `${prev}\n${current.join("")}`, ""));

    return 1000 * (pos.y + 1) + 4 * (pos.x + 1) + facingValue;
}

function getBounds(array: string[]): Bound {
    const beginning = [array.indexOf("#"), array.indexOf(".")];

    const end = [array.lastIndexOf("#"), array.lastIndexOf(".")];

    return {
        from: Math.min(...beginning.filter((e) => e !== -1)),
        to: Math.max(...end),
    };
}

function drawFacing(facing: Vec2, pos: Vec2, map: Grid2D<string>): void {
    let facingValue = "";

    if (facing.equals(RIGHT)) {
        facingValue = ">";
    } else if (facing.equals(DOWN)) {
        facingValue = "v";
    } else if (facing.equals(LEFT)) {
        facingValue = "<";
    } else {
        facingValue = "^";
    }

    // eslint-disable-next-line no-param-reassign
    map[pos.y][pos.x] = facingValue;
}
