import { } from '@lib/input';
import { Context } from '@app/types';
import { Grid2D, create } from '@lib/array2d';
import { Vec2 } from '@lib/math';

const NEIGHBORS = Vec2.ULRD;

const MAPPING = {
    '|': '│', '-': '─', 7: '┐', F: '┌', J: '┘', L: '└', '.': '.', S: 'S',
};

export default function (input: string[], { logger }: Context) {
    const map: Grid2D<string> = create(input[0].length, input.length);
    const pos: Vec2 = new Vec2(0, 0);

    // Build Map
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            map[y][x] = MAPPING[input[y][x]];

            if (input[y][x] === 'S') {
                pos.x = x;
                pos.y = y;
            }
        }
    }

    const candidates = NEIGHBORS.filter((dir) => canConnect(pos, dir, map));

    if (candidates.length !== 2) {
        throw new Error(`Invalid start position: ${pos}`);
    }

    let dir = candidates[0];

    pos.add(dir);

    let count = 1;
    // Move into both directions at the same time
    while (!map[pos.y][pos.x].match('S')) {
        dir = getNext(pos, dir, map);
        pos.add(dir);

        count++;
    }

    return count / 2;
}

const W = ['└', '─', '┌'];
const E = ['─', '┘', '┐'];
const N = ['│', '┐', '┌'];
const S = ['│', '┘', '└'];

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
        case '─':
            return (dir.x === 1) ? new Vec2(1, 0) : new Vec2(-1, 0);
        case '│':
            return (dir.y === 1) ? new Vec2(0, 1) : new Vec2(0, -1);
        case '└':
            return (dir.y === 1) ? new Vec2(1, 0) : new Vec2(0, -1);
        case '┘':
            return (dir.y === 1) ? new Vec2(-1, 0) : new Vec2(0, -1);
        case '┐':
            return (dir.x === 1) ? new Vec2(0, 1) : new Vec2(-1, 0);
        case '┌':
            return (dir.x === -1) ? new Vec2(0, 1) : new Vec2(1, 0);
        default:
            throw new Error(`Invalid pipe: ${current}`);
    }
}
