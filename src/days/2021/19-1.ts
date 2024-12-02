import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';
import { Vec3 } from '@lib/math';

type Scanner = {
    rotation?: Vec3,
    position?: Vec3,
    beacons: Vec3[],
    offsets: Vec3[],
};

const ROTATIONS: Vec3[] = []

export default function (input: string[], { logger }: Context) {
    const groups = getLineGroups(input);

    const scanners: Scanner[] = [];

    for (const [_, ...beacons] of groups) {
        const scanner: Scanner = {
            beacons: beacons.map((l) => {
                const s = l.split(',').map(c => Number(c.trim()));

                return new Vec3(s[0], s[1], s[2]);
            }),
            offsets: [],
        };

        for (let i = 0; i < scanner.beacons.length; i++) {
            for (let j = 0; j < scanner.beacons.length; j++) {
                if(i === j) continue;

                scanner.offsets.push(
                    Vec3.sub(scanner.beacons[i], scanner.beacons[j])
                );
            }
        }

        scanner.offsets.sort((a, b) => a.magnitude - b.magnitude);

        scanners.push(scanner);
    }

    scanners[0].position = new Vec3(0, 0, 0);
    scanners[0].rotation = new Vec3(0, 0, 0);
};