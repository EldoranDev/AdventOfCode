/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-param-reassign */
import { } from '@lib/input';
import { Context } from '@app/types';

type Vec = [x: number, y: number, z: number];

interface Brick {
    id?: string;
    from: Vec;
    to: Vec;
    settled?: boolean;
    supportedBy?: Brick[];
    supporting?: Brick[];
    moved?: boolean;
}

const VEC = {
    X: 0,
    Y: 1,
    Z: 2,
};

const BRICKS: Array<Brick> = [];

export default function (input: string[], { logger }: Context) {
    for (let i = 0; i < input.length; i++) {
        BRICKS.push(parse(
            input[i],
            String.fromCharCode(65 + i),
        ));
    }

    BRICKS.sort((a, b) => a.from[VEC.Z] - b.from[VEC.Z]);

    sim(BRICKS);

    const save = getSaveBricks(BRICKS);

    console.log('Save bricks: ', save.size);

    let count = 0;

    BRICKS.sort((a, b) => a.from[VEC.Z] - b.from[VEC.Z]);

    BRICKS.forEach((b) => {
        b.settled = false;
        b.moved = false;
        b.supportedBy = null;
        b.supporting = null;
    });

    for (let i = 0; i < BRICKS.length; i++) {
        const brick = BRICKS[i];

        if (save.has(brick.id!)) continue;

        const nb = JSON.parse(JSON.stringify(BRICKS)) as Array<Brick>;

        nb.splice(nb.findIndex((b) => b.id === brick.id), 1);

        sim(nb);

        const c = nb.filter((b) => b.moved).length;

        console.log(`Checking ${brick.id} (${i + 1}/${BRICKS.length}): ${c}`);

        count += c;
    }

    return count;
}

function sim(bricks: Array<Brick>): void {
    let allSettled = false;

    while (!allSettled) {
        allSettled = true;

        for (const brick of bricks) {
            if (brick.settled) continue;

            // Brick is already on the ground
            if (brick.from[2] <= 1 || brick.to[2] <= 1) {
                brick.settled = true;
                continue;
            }

            const next: Brick = {
                from: [...brick.from],
                to: [...brick.to],
                supporting: [],
            };

            next.from[VEC.Z] -= 1;
            next.to[VEC.Z] -= 1;

            const collisions = bricks.filter((c) => {
                // we do not coutn self collisions
                if (c === brick) return false;

                return intersect(c, next);
            });

            // We didn't collide with anything so we can move on
            if (collisions.length === 0) {
                // Move Down
                brick.from = next.from;
                brick.to = next.to;

                brick.moved = true;
            }

            const supportedBy = collisions.filter((c) => c.settled);

            if (supportedBy.length > 0) {
                brick.settled = true;

                if (brick.supportedBy) {
                    brick.supportedBy = supportedBy;
                    supportedBy.forEach((c) => c.supporting.push(brick));
                }
            }

            allSettled &&= brick.settled;
        }
    }
}

function parse(line: string, id: string): Brick {
    const [x1, y1, z1, x2, y2, z2] = /(-?\d+),(-?\d+),(-?\d+)~(-?\d+),(-?\d+),(-?\d+)/.exec(line)!.slice(1).map(Number);

    return {
        id,
        from: [x1, y1, z1],
        to: [x2, y2, z2],
        settled: false,
        supporting: [],
        supportedBy: [],
    };
}

function getSaveBricks(bricks: Array<Brick>): Set<string> {
    const result = new Set<string>();

    for (const brick of bricks) {
        if (brick.supporting.length === 0) {
            result.add(brick.id!);
            continue;
        }

        if (brick.supporting.every((b) => b.supportedBy.length >= 2)) {
            result.add(brick.id!);
            continue;
        }
    }

    return result;
}

// AABB intersection between cubes
function intersect(a: Brick, b: Brick): boolean {
    return (
        a.from[VEC.X] <= b.to[VEC.X]
        && a.to[VEC.X] >= b.from[VEC.X]
        && a.from[VEC.Y] <= b.to[VEC.Y]
        && a.to[VEC.Y] >= b.from[VEC.Y]
        && a.from[VEC.Z] <= b.to[VEC.Z]
        && a.to[VEC.Z] >= b.from[VEC.Z]
    );
}
