/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-param-reassign */
import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec3 } from '@lib/math';

interface Brick {
    id?: string;
    from: Vec3;
    to: Vec3;
    settled?: boolean;
    supportedBy?: Brick[];
    supporting?: Brick[];
}

const DOWN = new Vec3(0, 0, -1);

export default function (input: string[], { logger }: Context) {
    const bricks: Brick[] = [];

    for (let i = 0; i < input.length; i++) {
        bricks.push(parse(input[i], String.fromCharCode(65 + i)));
    }

    bricks.sort((a, b) => a.to.z - b.to.z);

    sim(bricks);

    let count = 0;

    for (const brick of bricks) {
        if (brick.supporting.length === 0) {
            count++;
            continue;
        }

        if (brick.supporting.every((b) => b.supportedBy.length >= 2)) {
            count++;
            continue;
        }
    }

    return count;
}

function sim(bricks: Array<Brick>): void {
    let allSettled = false;
    while (!allSettled) {
        allSettled = true;

        for (const brick of bricks) {
            if (brick.settled) continue;

            const next: Brick = {
                from: Vec3.add(brick.from, DOWN),
                to: Vec3.add(brick.to, DOWN),
            };

            if (brick.from.z <= 1 || brick.to.z <= 1) {
                brick.settled = true;
                continue;
            }

            const collisions = bricks.filter((c) => {
                if (c === brick) return false;

                return intersect(c, next);
            });

            // We didn't collide with anything so we can move on
            if (collisions.length === 0) {
                // Move Down
                brick.from = next.from;
                brick.to = next.to;
            }

            const supportedBy = collisions.filter((c) => c.settled);

            if (supportedBy.length > 0) {
                brick.supportedBy = supportedBy;
                brick.settled = true;

                supportedBy.forEach((c) => c.supporting.push(brick));
            }

            allSettled &&= brick.settled;
        }
    }
}

function parse(line: string, id: string): Brick {
    const [x1, y1, z1, x2, y2, z2] = /(-?\d+),(-?\d+),(-?\d+)~(-?\d+),(-?\d+),(-?\d+)/.exec(line)!.slice(1).map(Number);

    return {
        id,
        from: new Vec3(x1, y1, z1),
        to: new Vec3(x2, y2, z2),
        settled: false,
        supportedBy: [],
        supporting: [],
    };
}

// AABB intersection between cubes
function intersect(a: Brick, b: Brick): boolean {
    return (
        a.from.x <= b.to.x
        && a.to.x >= b.from.x
        && a.from.y <= b.to.y
        && a.to.y >= b.from.y
        && a.from.z <= b.to.z
        && a.to.z >= b.from.z
    );
}
