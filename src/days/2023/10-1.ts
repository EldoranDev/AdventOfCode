import { } from '@lib/input';
import { Context } from '@app/types';
import { Grid2D, create } from '@lib/array2d';
import { Vec2 } from '@lib/math';

const NEIGHBORS = Vec2.ULRD;

export default function (input: string[], { logger }: Context) {
    const map: Grid2D<string> = create(input[0].length, input.length);
    const start: Vec2 = new Vec2(0, 0);

    // Build Map
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            map[y][x] = input[y][x];

            if (input[y][x] === 'S') {
                start.x = x;
                start.y = y;
            }
        }
    }
    const [a, b] = [start.clone(), start.clone()];

    const candidates = NEIGHBORS.filter((dir) => canConnect(start, dir, map));

    if (candidates.length !== 2) {
        throw new Error(`Invalid start position: ${start}`);
    }

    let [dirA, dirB] = candidates;

    a.add(dirA);
    b.add(dirB);

    let count = 1;
    // Move into both directions at the same time
    while (!a.equals(b)) {
        dirA = getNext(a, dirA, map);
        dirB = getNext(b, dirB, map);

        a.add(dirA);
        b.add(dirB);

        count++;
    }

    return count;
}

const W = ['L', '-', 'F'];
const E = ['-', 'J', '7'];
const N = ['|', '7', 'F'];
const S = ['|', 'J', 'L'];

function canConnect(pos: Vec2, direction: Vec2, map: Grid2D<string>): boolean {
    const next = Vec2.add(pos, direction);

    if (!map[next.y] || !map[next.y][next.x] || map[next.y][next.x] === '.') {
        return false;
    }

    const pipe = map[next.y][next.x];

    if (direction.x === -1) {
        return W.includes(pipe);
    }

    if (direction.x === 1) {
        return E.includes(pipe);
    }

    if (direction.y === -1) {
        return N.includes(pipe);
    }

    return S.includes(pipe);
}

function getNext(pos: Vec2, dir: Vec2, map: Grid2D<string>): Vec2 {
    const current = map[pos.y][pos.x];

    switch (current) {
        case '-':
            return (dir.x === 1) ? new Vec2(1, 0) : new Vec2(-1, 0);
        case '|':
            return (dir.y === 1) ? new Vec2(0, 1) : new Vec2(0, -1);
        case 'L':
            return (dir.y === 1) ? new Vec2(1, 0) : new Vec2(0, -1);
        case 'J':
            return (dir.y === 1) ? new Vec2(-1, 0) : new Vec2(0, -1);
        case '7':
            return (dir.x === 1) ? new Vec2(0, 1) : new Vec2(-1, 0);
        case 'F':
            return (dir.x === -1) ? new Vec2(0, 1) : new Vec2(1, 0);
        default:
            throw new Error(`Invalid pipe: ${current}`);
    }
}
