import { mapToNumber } from "@lib/input";
import { Context } from "@app/types";

const EXTRACT = /(on|off) x=(\-?\d*)\.\.(\-?\d*),y=(\-?\d*)\.\.(\-?\d*),z=(\-?\d*)\.\.(\-?\d*)/;

type Cube = [number, number, number, number, number, number];
type Sign = -1 | 1;

export default function (input: string[], { logger }: Context) {
    const cuboids: Array<[Cube, Sign]> = [];

    for (const line of input) {
        const [_, state, x1s, x2s, y1s, y2s, z1s, z2s] = EXTRACT.exec(line);
        const [x1, x2, y1, y2, z1, z2] = mapToNumber([x1s, x2s, y1s, y2s, z1s, z2s]);

        const sign: Sign = state === "on" ? 1 : -1;

        // Can't update our cube list while working on it
        const update: Array<[Cube, Sign]> = [];

        for (const [cube, csign] of cuboids) {
            // Generate intersection points
            const ix = [Math.max(cube[0], x1), Math.min(cube[1], x2)];
            const iy = [Math.max(cube[2], y1), Math.min(cube[3], y2)];
            const iz = [Math.max(cube[4], z1), Math.min(cube[5], z2)];

            // Check if there is valid intersect
            if (ix[0] <= ix[1] && iy[0] <= iy[1] && iz[0] <= iz[1]) {
                // Negate what ever we know about the intersection points
                // by adding the inverse of the points in the intersect to our cuboids list
                update.push([[ix[0], ix[1], iy[0], iy[1], iz[0], iz[1]], (csign * -1) as Sign]);
            }
        }

        cuboids.push(...update);

        // We only care about cuboids that are turned on
        if (sign > 0) {
            cuboids.push([[x1, x2, y1, y2, z1, z2], sign]);
        }
    }

    // Sum up everything
    return cuboids.reduce((prev, cur) => {
        const [c, sign] = cur;
        return prev + (c[1] - c[0] + 1) * (c[3] - c[2] + 1) * (c[5] - c[4] + 1) * sign;
    }, 0);
}
