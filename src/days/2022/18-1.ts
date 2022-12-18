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

export default function (input: string[], { logger }: Context) {
    const cubes = input.map((line) => {
        const [x, y, z] = line.split(',').map((n) => Number(n));

        return new Vec3(x, y, z);
    });

    const cubeSet = new Set<string>(cubes.map((c) => c.toString()));

    let count = 0;

    for (const cube of cubes) {
        for (const dir of CUBE_DIRS) {
            const np = Vec3.add(cube, dir);

            if (!cubeSet.has(np.toString())) {
                count++;
            }
        }
    }

    return count;
}
