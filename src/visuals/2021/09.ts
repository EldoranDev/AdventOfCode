import { createCanvas } from 'canvas';
import { createWriteStream } from 'fs';

import { mapToNumber } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

export default async function (input: string[], { logger }: Context) {
    const map: number[][] = [];

    for (let line of input) {
        map.push(mapToNumber(line.split('')));
    }


    let pos = [
        new Vec2(0, 1),
        new Vec2(0, -1),
        new Vec2(1, 0),
        new Vec2(-1, 0),
    ];

    let lows = [];
    let basins: Vec2[][] = [];

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let valid = true;
            for (let off of pos) {
                if (
                    map[y + off.y] != undefined &&
                    map[y + off.y][x + off.x] !== undefined && 
                    map[y + off.y][x+ off.x] <= map[y][x] 
                ) {
                    valid = false;
                    break;
                }
            }      
            

            if (valid) {
                lows.push(new Vec2(x, y));
            }
        }
    }

    for (let low of lows) {
        let basin = [ ];
        let check = [ low ];

        while (check.length > 0) {
            let current = check.pop();

            basin.push(current);

            for (let p of pos) {
                let c = Vec2.add(p, current);

                if (
                    map[c.y] !== undefined &&
                    map[c.y][c.x] !== undefined && 
                    map[c.y][c.x] !== 9 &&
                    map[c.y][c.x] > map[current.y][current.x] &&
                    basin.findIndex(cc => c.equals(cc)) == -1 &&
                    check.findIndex(cc => c.equals(cc)) == -1
                ) {
                    check.push(c);
                }
            }
            
        }
        basins.push(basin);    
    }

    basins.sort((b, a) => a.length - b.length);

    const canvas = createCanvas(map[0].length * 10, map.length * 10);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, map[0].length * 10, map.length * 10);

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 9) {
                ctx.fillStyle = 'rgba(10, 10, 10, 1)';
                ctx.fillRect(x * 10, y * 10, 10, 10);
            } else {
                let col = Math.max(1, map[y][x] + 2)/10;

                ctx.fillStyle = `rgba(0, 0, 255, ${col})`;
                ctx.fillRect(x * 10, y * 10, 10, 10);
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        const basin = basins[i];

        for (let pos of basin) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(pos.x * 10, pos.y * 10, 10, 10);
        }
    }

    const stream = canvas.createPNGStream()
    const out = createWriteStream(__dirname + '/09.png');
    stream.pipe(out);
    
    await new Promise(resolve => out.on("finish", resolve));
};