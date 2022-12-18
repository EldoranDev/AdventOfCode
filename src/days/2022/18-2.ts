import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec3 } from '@lib/math';

const CUBE_DIRS = [
    new Vec3(1, 0, 0),
    new Vec3(-1, 0, 0),
    new Vec3(0, 1, 0),
    new Vec3(0, -1, 0),
    new Vec3(0, 0, 1),
    new Vec3(0, 0, -1),
];

const MIN = new Vec3();
const MAX = new Vec3();

export default function (input: string[], { logger }: Context) {
    const cubes = input.map((line) => {
        const [x, y, z] = line.split(',').map((n) => Number(n));
        MIN.x = Math.min(MIN.x, x);
        MIN.y = Math.min(MIN.y, y);
        MIN.z = Math.min(MIN.z, z);

        MAX.x = Math.max(MAX.x, x);
        MAX.y = Math.max(MAX.y, y);
        MAX.z = Math.max(MAX.z, z);

        return new Vec3(x, y, z);
    });

    const cubeMap = new Map<string, boolean>();

    const cubeSet = new Set<string>(cubes.map((c) => c.toString()));

    let count = 0;

    for (const cube of cubes) {
        for (const dir of CUBE_DIRS) {
            const np = Vec3.add(cube, dir);

            if (cubeSet.has(np.toString())) {
                continue;
            }

            const result = checkExterior(np, cubeSet, cubeMap);

            result.checked.forEach((c) => {
                cubeMap.set(c, result.exterior);
            });

            if (result.exterior) {
                count++;
            }
        }
    }

    return count;
}

function checkExterior(
    point: Vec3,
    set: Set<string>,
    cache: Map<string, boolean>,
): { exterior: boolean, checked: Array<string> } {
    const checked = new Set<string>();
    const open: Array<Vec3> = [
        point,
    ];

    while (open.length > 0) {
        const check = open.pop();

        if (cache.has(check.toString())) {
            return { exterior: cache.get(check.toString()), checked: [...checked.values()] };
        }

        if (check.x < MIN.x || check.y < MIN.y || check.z < MIN.z) {
            return { exterior: true, checked: [...checked.values()] };
        }

        if (check.x > MAX.x || check.y > MAX.y || check.z > MAX.z) {
            return { exterior: true, checked: [...checked.values()] };
        }

        for (const dir of CUBE_DIRS) {
            const np = Vec3.add(dir, check);

            if (checked.has(np.toString())) {
                continue;
            }

            if (set.has(np.toString())) {
                continue;
            }

            checked.add(np.toString());
            open.push(np);
        }
    }

    return { exterior: false, checked: [...checked.values()] };
}
