/* eslint-disable no-case-declarations */
import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";
import { create, getColumn } from "@lib/array2d";
import { Vec2 } from "@lib/math";
import { Grid2D } from "@lib/array2d/create";

type Bounding = { from: number; to: number };
type Boundings = Array<Bounding>;
type Wrap = [Vec2, Vec2];

const UP = new Vec2(0, -1);
const DOWN = new Vec2(0, 1);
const LEFT = new Vec2(-1, 0);
const RIGHT = new Vec2(1, 0);

let SIZE = 50;

export default function (input: string[], { logger, test }: Context) {
    const [mapRaw, [instructions]] = getLineGroups(input);

    if (test) {
        SIZE = 4;
    }

    const map = create<string>(mapRaw[0].length, mapRaw.length);

    const rows: Boundings = Array.from({ length: mapRaw.length });
    const columns: Boundings = Array.from({ length: mapRaw[0].length });

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
                const [newPos, newFacing] = calculateWrap(
                    pos,
                    Vec2.add(pos, facing),
                    facing,
                    rows,
                    columns,
                );

                if (map[newPos.y][newPos.x] === "#") {
                    break;
                }

                drawFacing(facing, pos, map);

                facing.x = newFacing.x;
                facing.y = newFacing.y;

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

function getBounds(array: string[]): Bounding {
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

function calculateWrap(
    pos: Vec2,
    newPos: Vec2,
    facing: Vec2,
    rows: Boundings,
    cols: Boundings,
): Wrap {
    const np = newPos.clone();

    if (facing.equals(UP)) {
        if (np.y >= cols[np.x].from) {
            return [np, facing];
        }

        // Wrap for Face 1 -> 2
        switch (getFace(pos)) {
            case 1:
                return [toMap(new Vec2(0, toLocal(np, 1).x), 6), RIGHT.clone()];
            case 2:
                return [toMap(new Vec2(toLocal(np, 2).x, SIZE - 1), 6), UP.clone()];
            case 3:
                throw new Error("Wrapping error 3->1");
            case 4:
                // this should not happen it simply wraps to 1 without extra rules
                return [toMap(new Vec2(0, toLocal(np, 4).x), 3), RIGHT.clone()];
            case 5:
                // This should not happen it simply wraps to 4 without extra rules
                throw new Error("Wrapping error 5->3");
            case 6:
                throw new Error("Wrapping error 6->4");
            default:
                throw new Error("Face detection error");
        }
    }

    if (facing.equals(DOWN)) {
        if (np.y <= cols[np.x].to) {
            return [np, facing];
        }

        // Wrap for Face 1 -> 2
        switch (getFace(pos)) {
            case 1:
                throw new Error("Wrapping error 1->3");
            case 2:
                return [toMap(new Vec2(SIZE - 1, toLocal(np, 2).x), 3), LEFT.clone()];
            case 3:
                throw new Error("Wrapping error 3->5");
            case 4:
                // this should not happen it simply wraps to 1 without extra rules
                throw new Error("Wrapping error 4->6");
            case 5:
                return [toMap(new Vec2(SIZE - 1, toLocal(np, 5).x), 6), LEFT.clone()];
            case 6:
                return [toMap(new Vec2(toLocal(np, 6).x, 0), 2), DOWN.clone()];
            default:
                throw new Error("Face detection error");
        }
    }

    if (facing.equals(LEFT)) {
        if (np.x >= rows[np.y].from) {
            return [np, facing];
        }

        // Wrap for Face 1 -> 2
        switch (getFace(pos)) {
            case 1:
                return [toMap(new Vec2(0, SIZE - 1 - toLocal(np, 1).y), 4), RIGHT.clone()];
            case 2:
                throw new Error("Wrapping error 2->1");
            case 3:
                return [toMap(new Vec2(toLocal(np, 3).y, 0), 4), DOWN.clone()];
            case 4:
                return [toMap(new Vec2(0, SIZE - 1 - toLocal(np, 4).y), 1), RIGHT.clone()];
            case 5:
                throw new Error("Wrapping error 5->4");
            case 6:
                return [toMap(new Vec2(toLocal(np, 6).y, 0), 1), DOWN.clone()];
            default:
                throw new Error("Face detection error");
        }
    }

    if (facing.equals(RIGHT)) {
        if (np.x <= rows[np.y].to) {
            return [np, facing];
        }

        switch (getFace(pos)) {
            case 1:
                throw new Error("Wrapping error 1->2");
            case 2:
                return [toMap(new Vec2(SIZE - 1, SIZE - 1 - toLocal(np, 2).y), 5), LEFT.clone()];
            case 3:
                return [toMap(new Vec2(toLocal(np, 3).y, SIZE - 1), 2), UP.clone()];
            case 4:
                throw new Error("Wrapping error 4->5");
            case 5:
                return [toMap(new Vec2(SIZE - 1, SIZE - 1 - toLocal(np, 5).y), 2), LEFT.clone()];
            case 6:
                return [toMap(new Vec2(toLocal(np, 6).y, SIZE - 1), 5), UP.clone()];
            default:
                throw new Error("Face detection error");
        }
    }

    throw new Error("Unknown direction");
}

function getFace(pos: Vec2): 1 | 2 | 3 | 4 | 5 | 6 {
    if (pos.y < SIZE && pos.x >= SIZE && pos.x < SIZE * 2) {
        return 1;
    }

    if (pos.y < SIZE && pos.x >= SIZE * 2) {
        return 2;
    }

    if (pos.y >= SIZE && pos.y < SIZE * 2) {
        return 3;
    }

    if (pos.x < SIZE && pos.y >= SIZE * 2 && pos.y < SIZE * 3) {
        return 4;
    }

    if (pos.x >= SIZE && pos.y >= SIZE * 2 && pos.y < SIZE * 3) {
        return 5;
    }

    return 6;
}

function toLocal(pos: Vec2, face: number) {
    switch (face) {
        case 1:
            return new Vec2(pos.x - SIZE, pos.y);
        case 2:
            return new Vec2(pos.x - SIZE * 2, pos.y);
        case 3:
            return new Vec2(pos.x - SIZE, pos.y - SIZE);
        case 4:
            return new Vec2(pos.x, pos.y - SIZE * 2);
        case 5:
            return new Vec2(pos.x - SIZE, pos.y - SIZE * 2);
        case 6:
            return new Vec2(pos.x, pos.y - SIZE * 3);
        default:
            throw new Error("toLocal error");
    }
}

function toMap(pos: Vec2, face: number) {
    switch (face) {
        case 1:
            return new Vec2(pos.x + SIZE, pos.y);
        case 2:
            return new Vec2(pos.x + SIZE * 2, pos.y);
        case 3:
            return new Vec2(pos.x + SIZE, pos.y + SIZE);
        case 4:
            return new Vec2(pos.x, pos.y + SIZE * 2);
        case 5:
            return new Vec2(pos.x + SIZE, pos.y + SIZE * 2);
        case 6:
            return new Vec2(pos.x, pos.y + SIZE * 3);
        default:
            throw new Error("toMap error");
    }
}
