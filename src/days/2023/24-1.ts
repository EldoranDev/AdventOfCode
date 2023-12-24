import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2, Vec3 } from '@lib/math';

interface Storm {
    position: Vec3;
    velocity: Vec3;
}

// Test Values
// const MIN = new Vec2(7, 7);
// const MAX = new Vec2(27, 27);

// Actuall Values
const MIN = new Vec2(200000000000000, 200000000000000);
const MAX = new Vec2(400000000000000, 400000000000000);

export default function (input: string[], { logger }: Context) {
    const storms = input.map(parse);

    let count = 0;

    for (let i = 0; i < storms.length; i++) {
        for (let j = i + 1; j < storms.length; j++) {
            const intersection = intersect(storms[i], storms[j]);

            logger.debug('');

            logger.debug(`Hailstone A: ${storms[i].position} @ ${storms[i].velocity}`);
            logger.debug(`Hailstone B: ${storms[j].position} @ ${storms[j].velocity}`);

            if (intersection === null) {
                logger.debug('No intersection');
                continue;
            }

            if (intersection.x <= MIN.x || intersection.x >= MAX.x || intersection.y <= MIN.y || intersection.y >= MAX.y) {
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
    const a1 = a.position;
    const a2 = Vec3.add(a.position, a.velocity);

    const b1 = b.position;
    const b2 = Vec3.add(b.position, b.velocity);

    const den = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);

    if (den === 0) {
        return null;
    }

    const x = ((a1.x * a2.y - a1.y * a2.x) * (b1.x - b2.x) - (a1.x - a2.x) * (b1.x * b2.y - b1.y * b2.x)) / den;
    const y = ((a1.x * a2.y - a1.y * a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x * b2.y - b1.y * b2.x)) / den;

    return new Vec2(x, y);
}

function isInFuture(storm: Storm, point: Vec2): boolean {
    const tx = point.x - storm.position.x / storm.velocity.x;
    const ty = point.y - storm.position.y / storm.velocity.y;

    if (tx <= 0 || ty <= 0) {
        return false;
    }

    return true;
}

function parse(line: string): Storm {
    const [x, y, z, vx, vy, vz] = /(\d*),\s*(\d*),\s*(\d*)\s*@\s*(-?\d*),\s*(-?\d*),\s*(-?\d*)/.exec(line).slice(1).map(Number);
    return {
        position: new Vec3(x, y, z),
        velocity: new Vec3(vx, vy, vz),
    };
}
