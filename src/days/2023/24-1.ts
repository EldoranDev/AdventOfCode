import {} from "@lib/input";
import { Context } from "@app/types";

import { BigNumber } from "bignumber.js";

type Vec2 = [BigNumber, BigNumber];
type Vec3 = [BigNumber, BigNumber, BigNumber];

interface Storm {
    position: Vec3;
    velocity: Vec3;
}

// Test Values
// const MIN = [new BigNumber(7), new BigNumber(7)];
// const MAX = [new BigNumber(27), new BigNumber(27)];

// Actuall Values
const MIN = [new BigNumber(200000000000000), new BigNumber(200000000000000)];
const MAX = [new BigNumber(400000000000000), new BigNumber(400000000000000)];

export default function (input: string[], { logger }: Context) {
    const storms = input.map(parse);

    let count = 0;

    for (let i = 0; i < storms.length; i++) {
        for (let j = i + 1; j < storms.length; j++) {
            const intersection = intersect(storms[i], storms[j]);

            logger.debug("");

            logger.debug(`Hailstone A: ${storms[i].position} @ ${storms[i].velocity}`);
            logger.debug(`Hailstone B: ${storms[j].position} @ ${storms[j].velocity}`);

            if (intersection === null) {
                logger.debug("No intersection");
                continue;
            }

            if (
                intersection[0].isLessThanOrEqualTo(MIN[0]) ||
                intersection[0].isGreaterThanOrEqualTo(MAX[0]) ||
                intersection[1].isLessThanOrEqualTo(MIN[1]) ||
                intersection[1].isGreaterThanOrEqualTo(MAX[1])
            ) {
                logger.debug(`Intersection outside of test area: ${intersection}`);
                continue;
            }

            if (!isInFuture(storms[i], intersection) || !isInFuture(storms[j], intersection)) {
                logger.debug(`Intersection in the past: ${intersection}`);
                continue;
            }

            logger.debug(`Intersection inside: ${intersection}`);

            count++;
        }
    }

    return count;
}

function intersect(a: Storm, b: Storm): Vec2 | null {
    const [x1, y1] = a.position;
    const [x2, y2] = [a.position[0].plus(a.velocity[0]), a.position[1].plus(a.velocity[1])];

    const [x3, y3] = b.position;
    const [x4, y4] = [b.position[0].plus(b.velocity[0]), b.position[1].plus(b.velocity[1])];

    const den = x1
        .minus(x2)
        .multipliedBy(y3.minus(y4))
        .minus(y1.minus(y2).multipliedBy(x3.minus(x4)));

    if (den.isZero()) {
        return null;
    }

    // eslint-disable-next-line max-len
    const x = x1
        .multipliedBy(y2)
        .minus(y1.multipliedBy(x2))
        .multipliedBy(x3.minus(x4))
        .minus(x1.minus(x2).multipliedBy(x3.multipliedBy(y4).minus(y3.multipliedBy(x4))))
        .dividedBy(den);

    // eslint-disable-next-line max-len
    const y = x1
        .multipliedBy(y2)
        .minus(y1.multipliedBy(x2))
        .multipliedBy(y3.minus(y4))
        .minus(y1.minus(y2).multipliedBy(x3.multipliedBy(y4).minus(y3.multipliedBy(x4))))
        .dividedBy(den);

    return [x, y];
}

function isInFuture(storm: Storm, point: Vec2): boolean {
    const dx = point[0].minus(storm.position[0]);
    const dy = point[1].minus(storm.position[1]);

    return (
        ((dx.isPositive() && storm.velocity[0].isPositive()) ||
            (dx.isNegative() && storm.velocity[0].isNegative())) &&
        ((dy.isPositive() && storm.velocity[1].isPositive()) ||
            (dy.isNegative() && storm.velocity[1].isNegative()))
    );
}

function parse(line: string): Storm {
    const [x, y, z, vx, vy, vz] = /(\d*),\s*(\d*),\s*(\d*)\s*@\s*(-?\d*),\s*(-?\d*),\s*(-?\d*)/
        .exec(line)
        .slice(1)
        .map((n) => new BigNumber(n));
    return {
        position: [x, y, z],
        velocity: [vx, vy, vz],
    };
}
