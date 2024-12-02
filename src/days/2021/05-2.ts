import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import { create } from '@lib/array2d';

export default function (input: string[], { logger }: Context) {
    let highestX = 0;
    let highestY = 0;

    const lines = input.map((line) => {
        const split = line.split('->');

        const [ sX, sY ] = split[0].trim().split(',').map(s => parseInt(s));
        const [ eX, eY ] = split[1].trim().split(',').map(s => parseInt(s));
        
        highestX = Math.max(highestX, sX, eX);
        highestY = Math.max(highestY, sY, eY);

        return {
            start: new Vec2(sX, sY),
            end: new Vec2(eX, eY),
        };
    });

    const map = create<number>(highestX + 1, highestY + 1, 0);

    for(const line of lines) {
        const pos = line.start.clone();
        const diff = Vec2.sub(line.end, line.start);

        const dir = new Vec2(
            Math.sign(diff.x),
            Math.sign(diff.y)
        );

        while(!pos.equals(line.end)) {
            map[pos.y][pos.x]++;

            pos.add(dir);
        }

        map[pos.y][pos.x]++;
    }
    let count = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] > 1) {
                count++;
            }
        }
    }

    const output = map.reduce((prev, row) => {
        return prev + "\n" + row.join();
    }, "")

    logger.debug(output);

    return count;
};