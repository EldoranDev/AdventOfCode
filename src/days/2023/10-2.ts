import { } from '@lib/input';
import { Context } from '@app/types';
import { Grid2D, create } from '@lib/array2d';
import { Vec2 } from '@lib/math';
import { stdout } from 'process';

const NEIGHBORS = Vec2.ULRD;
const MAP = {
    '|': '│',
    '-': '─',
    7: '┐',
    F: '┌',
    J: '┘',
    L: '└',
    '.': '.',
    S: 'S',
};

type Pipe = '|' | '-' | '7' | 'F' | 'J' | 'L' | '.';

export default function (input: string[], { logger }: Context) {
    const map: Grid2D<Pipe> = create(input[0].length, input.length);
    const start: Vec2 = new Vec2(0, 0);
    const loop: Set<string> = new Set();

    const nestPositions: Set<string> = new Set();
    const checked: Set<string> = new Set();

    let toCheck: Vec2[] = [];

    // Build Map
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            map[y][x] = input[y][x] as Pipe;

            if (input[y][x] === 'S') {
                start.x = x;
                start.y = y;
            }
        }
    }
    const [a, b] = [start.clone(), start.clone()];

    const candidates = NEIGHBORS.filter((dir) => canConnect(start.clone(), dir, map));

    if (candidates.length !== 2) {
        throw new Error(`Invalid start position: ${start}`);
    }

    loop.add(start.toString());

    // eslint-disable-next-line prefer-const
    let [dirA, dirB] = candidates;

    a.add(dirA);
    b.add(dirB);

    loop.add(a.toString());
    loop.add(b.toString());

    const insideA = new Vec2(-1, 0);

    while (!a.equals(b)) {
        dirA = getNext(a, dirA, map);

        for (const pos of getToCheck(map[a.y][a.x], insideA, dirA, a)) {
            toCheck.push(pos);
        }

        a.add(dirA);

        loop.add(a.toString());

        rotate(dirA, insideA, map[a.y][a.x]);
    }

    toCheck = toCheck.filter((pos) => !loop.has(pos.toString()));

    while (toCheck.length > 0) {
        const current = toCheck.shift()!;

        if (checked.has(current.toString())) {
            continue;
        }

        checked.add(current.toString());

        if (!loop.has(current.toString())) {
            nestPositions.add(current.toString());

            NEIGHBORS.forEach((dir) => {
                const candidate = Vec2.add(current, dir);

                if (checked.has(candidate.toString())) {
                    return;
                }

                if (
                    candidate.x > map[0].length
                    || candidate.y > map.length
                    || candidate.x < 0
                    || candidate.y < 0
                ) {
                    return;
                }

                toCheck.push(candidate);
            });
        }
    }

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            stdout.write('\x1b[90m');

            if (nestPositions.has(new Vec2(x, y).toString())) {
                stdout.write('\x1b[31m');
            }

            if (loop.has(new Vec2(x, y).toString())) {
                stdout.write('\x1b[33m');
            }

            stdout.write(MAP[map[y][x]]);
            stdout.write('\x1b[0m');
        }

        stdout.write('\n');
    }

    return nestPositions.size;
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

function getNext(pos: Vec2, dir: Vec2, map: Grid2D<Pipe>): Vec2 {
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

function rotate(dir: Vec2, rot: Vec2, pipe: Pipe): void {
    const DEGREE = 90;
    switch (pipe) {
        case '-':
        case '|':
            return;
        case 'L':
            rot.rotate((dir.y === 1) ? -DEGREE : DEGREE);
            break;
        case 'J':
            rot.rotate((dir.y === 1) ? DEGREE : -DEGREE);
            break;
        case '7':
            rot.rotate((dir.x === 1) ? DEGREE : -DEGREE);
            break;
        case 'F':
            rot.rotate((dir.y === -1) ? DEGREE : -DEGREE);
            break;
        default:
            throw new Error(`Invalid pipe: ${pipe}`);
    }
}

function getToCheck(pipe: Pipe, inner: Vec2, dir: Vec2, pos: Vec2): Array<Vec2> {
    switch (pipe) {
        case '-':
        case '|':
            return [Vec2.add(inner, pos)];
        case 'L':
            if (inner.x === 1 || inner.y === -1) {
                return [Vec2.add(inner, pos)];
            }

            return [
                Vec2.add(pos, new Vec2(-1, 0)),
                Vec2.add(pos, new Vec2(0, 1)),
            ];
        case 'J':
            if (inner.x === -1 || inner.y === -1) {
                return [Vec2.add(inner, pos)];
            }

            return [
                Vec2.add(pos, new Vec2(1, 0)),
                Vec2.add(pos, new Vec2(0, 1)),
            ];
        case 'F':
            if (inner.x === 1 || inner.y === 1) {
                return [Vec2.add(inner, pos)];
            }

            return [
                Vec2.add(pos, new Vec2(-1, 0)),
                Vec2.add(pos, new Vec2(0, -1)),
            ];
        case '7':
            if (inner.x === -1 || inner.y === 1) {
                return [Vec2.add(inner, pos)];
            }

            return [
                Vec2.add(pos, new Vec2(1, 0)),
                Vec2.add(pos, new Vec2(0, -1)),
            ];
        default:
            throw new Error(`Invalid pipe: ${pipe}`);
    }
}
