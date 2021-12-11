import { } from '@lib/input';
import { Context } from '@app/types';
import { create } from '@lib/array2d';
import { Vec2 } from '@lib/math';

import { createCanvas } from 'canvas';
import { createWriteStream, rmSync, mkdirSync, mkdir } from 'fs';

import * as GifEncoder from 'gifencoder';

const pngFileStream = require('png-file-stream');

export default async function (input: string[], { logger }: Context) {
    let map = create(input[0].length, input.length, 0);

    for (let y = 0; y < input.length; y++) {
        let cols = input[y].split('');

        for (let x = 0; x < input[y].length; x++) {
            map[y][x] = Number(cols[x]);
        }
    }

    const ALL = map[0].length * map.length;
    const TILE_SIZE = 20;

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

    const canvas = createCanvas(input[0].length * TILE_SIZE, input.length * TILE_SIZE);
    const ctx = canvas.getContext('2d');

    let frame = 0;

    try {
        mkdirSync(__dirname + '/11');
    } catch(e) {
        logger.error(e);
    }

    for (let r = 0;; r++) {
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
            
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, input[0].length * TILE_SIZE, input.length * TILE_SIZE);

            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    ctx.fillStyle = `rgba(219, 0, 0, 0.${map[y][x]})`;
                    ctx.fillRect(y * TILE_SIZE, x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }

            const stream = canvas.createPNGStream()
            const out = createWriteStream(__dirname + `/11/${frame}.png`);
            stream.pipe(out);
            
            await new Promise(resolve => out.on("finish", resolve));

            frame++;
        } while(hadChange)
    
        if (flashed.size === ALL) {
            break;
        }
    }

    const encoder = new GifEncoder(canvas.width, canvas.height);

    const stream = pngFileStream(__dirname + "/11/*.png")
        .pipe(encoder.createWriteStream({ repeat: -1, delay: 100, quality: 10}))
        .pipe(createWriteStream(__dirname + '/11.gif'));

    await new Promise(resolve => stream.on('finish', resolve));

    
    rmSync(__dirname + '/11', { recursive: true });
};