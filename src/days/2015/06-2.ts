import {} from "@lib/input";
import { Vec2 } from "@lib/math";

const HEIGHT = 1000;
const WIDTH = 1000;

const TURN = /turn (on|off) (\d+,\d+) through (\d+,\d+)/;
const TOGGLE = /toggle (\d+,\d+) through (\d+,\d+)/;

const map: number[][] = [];

export default function (input: string[]) {
    for (let i = 0; i < HEIGHT; i++) {
        map[i] = Array(WIDTH).fill(0, 0, WIDTH);
    }

    for (const line of input) {
        let result = TURN.exec(line);

        if (result !== null) {
            turn(toVec(result[2]), toVec(result[3]), result[1] === "on");
        }

        result = TOGGLE.exec(line);

        if (result !== null) {
            toggle(toVec(result[1]), toVec(result[2]));
        }
    }
    let count = 0;

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            count += map[x][y];
        }
    }

    return count;
}

function toggle(from: Vec2, to: Vec2) {
    for (let x = from.x; x <= to.x; x++) {
        for (let y = from.y; y <= to.y; y++) {
            map[x][y] += 2;
        }
    }
}

function turn(from: Vec2, to: Vec2, state: boolean) {
    for (let x = from.x; x <= to.x; x++) {
        for (let y = from.y; y <= to.y; y++) {
            map[x][y] += state ? 1 : -1;

            if (map[x][y] < 0) {
                map[x][y] = 0;
            }
        }
    }
}

function toVec(coords: string): Vec2 {
    const split = coords.split(",");

    return new Vec2(Number(split[0]), Number(split[1]));
}
