/* eslint-disable max-len */
import { } from '@lib/input';
import { Context } from '@app/types';
import { MinHeap } from '@lib/collections';
import { Vec2 } from '@lib/math';

interface Node {
    pos: Vec2;
    dir: Vec2;
    dirc: number;

    costs: number;
}

export default function (input: string[], { logger }: Context) {
    const map = input.map((line) => line.split('').map((c) => parseInt(c, 10)));

    const queue = new MinHeap<Node>();
    const seen = new Set<string>();

    const end = new Vec2(map[0].length - 1, map.length - 1);

    queue.push({
        pos: new Vec2(0, 0),
        dir: new Vec2(0, 0),
        costs: 0,
        dirc: 0,
    }, 0);

    while (queue.length > 0) {
        const current = queue.shift();

        if (current.pos.equals(end) && current.dirc >= 4) {
            return current.costs;
        }

        if (current.pos.x < 0 || current.pos.y < 0 || current.pos.x >= map[0].length || current.pos.y >= map.length) {
            continue;
        }

        const key = `${current.pos}${current.dir}${current.dirc}`;

        // Been here before
        if (seen.has(key)) {
            continue;
        }

        seen.add(key);

        if (current.dirc < 10 && !current.dir.equals(new Vec2(0, 0))) {
            const np = Vec2.add(current.pos, current.dir);

            if (!(np.x < 0 || np.y < 0 || np.x >= map[0].length || np.y >= map.length)) {
                queue.push({
                    pos: Vec2.add(current.pos, current.dir),
                    dir: current.dir.clone(),
                    dirc: current.dirc + 1,

                    costs: current.costs + map[np.y][np.x],
                }, current.costs + map[np.y][np.x]);
            }
        }

        if (current.dirc >= 4 || current.dir.equals(new Vec2(0, 0))) {
            for (const ndir of [new Vec2(0, 1), new Vec2(0, -1), new Vec2(1, 0), new Vec2(-1, 0)]) {
                // Same direction as before (checked above)
                if (current.dir.equals(ndir)) {
                    continue;
                }

                // check that we're not reversing
                if (current.dir.equals(Vec2.mult(ndir, -1))) {
                    continue;
                }

                const np = Vec2.add(current.pos, ndir);

                if (np.x < 0 || np.y < 0 || np.x >= map[0].length || np.y >= map.length) {
                    continue;
                }

                queue.push({
                    pos: np,
                    dir: ndir.clone(),
                    dirc: 1,

                    costs: current.costs + map[np.y][np.x],
                }, current.costs + map[np.y][np.x]);
            }
        }
    }

    throw new Error('No route found');
}
