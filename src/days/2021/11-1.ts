import { } from '@lib/input';
import { Context } from '@app/types';
import { create } from '@lib/array2d';
import { Vec2 } from '@lib/math';

export default function (input: string[], { logger }: Context) {
    let map = create(input[0].length, input.length, 0);

    for (let y = 0; y < input.length; y++) {
        let cols = input[y].split('');

        for (let x = 0; x < input[y].length; x++) {
            map[y][x] = Number(cols[x]);
        }
    }

    const ROUNDS = 100;

    let adjacents = [
        new Vec2(0, 1),
        new Vec2(0, -1),
        new Vec2(1, -1),
        new Vec2(-1, 1),
        new Vec2(-1, -1),
        new Vec2(1, 1),
        new Vec2(1, 0),
        new Vec2(-1, 0),
    ];

    let count = 0;

    for (let r = 0; r < ROUNDS; r++) {
        let hadChange = false;

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                map[y][x] += 1;
            }
        }
        
        let flashed = new Set<Vec2>();
        
        do {
            hadChange = false;

            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    let pos = new Vec2(x, y);

                    if (map[y][x] > 9) {
                        
                        if (flashed.has(pos)) {
                            continue;
                        }

                        count += 1;
                        hadChange = true;

                        for (let adj of adjacents) {
                            let ap = Vec2.add(adj, pos);

                            if (
                                map[ap.y] !== undefined &&
                                map[ap.y][ap.x] !== undefined
                            ) {
                                map[ap.y][ap.x] += 1;
                            }
                        }

                        flashed.add(pos);
                    }
                }
            }

            for (let p of flashed) {
                map[p.y][p.x] = 0;
            }
        } while(hadChange)

        logger.debug(
            '\n' + map.map((row) => row.join('')).join('\n')
        );
    }

    

    return count;
};