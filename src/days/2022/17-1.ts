/* eslint-disable no-param-reassign */
import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import create, { Grid2D } from '@lib/array2d/create';

interface Rock {
    height: number;
    width: number;

    shape: Array<Vec2>;
}

interface FallingRock {
    rock: Rock;
    pos: Vec2;
}

type Map = Grid2D<string>;

const ROCKS: Array<Rock> = [
    // ####
    {
        height: 1,
        width: 4,
        shape: [new Vec2(0, 0), new Vec2(1, 0), new Vec2(2, 0), new Vec2(3, 0)],
    },

    // .#.
    // ###
    // .#.
    {
        height: 3,
        width: 3,
        shape: [new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1), new Vec2(2, 1), new Vec2(1, 2)],
    },

    // ..#
    // ..#
    // ###
    {
        height: 3,
        width: 3,
        shape: [new Vec2(2, 0), new Vec2(2, 1), new Vec2(0, 2), new Vec2(1, 2), new Vec2(2,2 )],
    },

    // #
    // #
    // #
    // #
    {
        height: 4,
        width: 1,
        shape: [new Vec2(0, 0), new Vec2(0, 1), new Vec2(0, 2), new Vec2(0, 3)],
    },

    // ##
    // ##
    {
        height: 2,
        width: 2,
        shape: [new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1)],
    },
];

const ROUNDS = 2022;

const WIDTH = 7;

const DIR = {
    '>': Vec2.RIGHT,
    '<': Vec2.LEFT,
};

export default function (input: string[], { logger }: Context) {
    let highest = 0;
    const streams = input[0];

    const map: Map = create(WIDTH, 0);

    let rocks = 0;
    let current: FallingRock = null;

    for (let i = 0; rocks < ROUNDS; i++) {
        if (current === null) {
            const neededHight = highest + 3 + (ROCKS[rocks % ROCKS.length].height);

            while (map.length < neededHight) {
                map.unshift(Array.from({ length: WIDTH }, () => '.'));
            }

            let y = 0;

            if (neededHight < map.length) {
                y = map.length - neededHight;
            }

            current = {
                pos: new Vec2(2, y),
                rock: ROCKS[rocks % ROCKS.length],
            };
        }

        const d: Vec2 = DIR[streams[i % streams.length]];

        // Check stream move
        if (moveAllowed(current, d, map)) {
            current.pos.add(d);
        }

        // check gravity (UP as the index is upside down)
        if (moveAllowed(current, Vec2.UP, map)) {
            current.pos.add(Vec2.UP);
            continue;
        }

        rocks += 1;
        highest = Math.max(highest, map.length - current.pos.y);

        save(current, map);
        current = null;
    }

    return highest;
}

function save(rock: FallingRock, grid: Map) {
    for (const p of rock.rock.shape) {
        grid[rock.pos.y + p.y][rock.pos.x + p.x] = '#';
    }
}

function moveAllowed(rock: FallingRock, directon: Vec2, grid: Map) {
    const np = Vec2.add(rock.pos, directon);

    for (const block of rock.rock.shape) {
        const ny = np.y + block.y;
        const nx = np.x + block.x;

        if (ny >= grid.length || nx >= grid[0].length) {
            return false;
        }

        if (grid[ny][nx] !== '.') {
            return false;
        }
    }

    return true;
}
