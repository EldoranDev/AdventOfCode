import { getLineGroups, mapToNumber } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import { GeneralSet } from '@lib/collections';
import { createCanvas } from 'canvas';
import { createWriteStream, mkdirSync, rmSync } from 'fs';

import * as GifEncoder from 'gifencoder';

const pngFileStream = require('png-file-stream');

export default async function (input: string[], { logger }: Context) {
    let coords = new GeneralSet<Vec2>();

    const groups = getLineGroups(input);

    groups[0].forEach((line) => {
        const [x, y] = mapToNumber(line.split(','))
        coords.add(new Vec2(x, y));
    }, new GeneralSet<Vec2>());

    let [X, Y] = [...coords.values()].reduce<[number, number]>(
        (val, current) => [ Math.max(val[0], current.x), Math.max(val[1], current.y)], [0, 0]
    );

    const canvas = createCanvas(X, Y);
    const ctx = canvas.getContext('2d');

    try {
        mkdirSync(__dirname + '/13');
    } catch(e) {
        logger.error(e);
    }

    let frame = 0;
    
    let zoom = 1;

    for (let i = 0; i < groups[1].length; i++) {
        const instr = groups[1][i];
        
        zoom = i/2+1|0;

        ctx.fillStyle = '#363537';
        ctx.fillRect(0, 0, X, Y);

        const [_, axis, index ] = /fold along ([xy])=([0-9]*)/.exec(instr);

        if (axis === 'x') {
            coords = new GeneralSet<Vec2>(
                [...coords.values()].map((v => new Vec2(
                    v.x < Number(index) ? v.x : 2 * Number(index) - v.x,
                    v.y
                )))
            );
        } else {
            coords = new GeneralSet<Vec2>(
                [...coords.values()].map((v => new Vec2(
                    v.x,
                    v.y < Number(index) ? v.y : 2 * Number(index) - v.y
                )))
            );
        }

        let [XX, YY] = [...coords.values()].reduce<[number, number]>(
            (val, current) => [ Math.max(val[0], current.x), Math.max(val[1], current.y)], [0, 0]
        );
        
        let o = new Vec2(
            (X/2)-(XX/2)*zoom,
            (Y/2)-(YY/2)*zoom,
        );

        ctx.strokeStyle = '#E3F2FD'
        ctx.strokeRect(
            (X/2)-(XX/2)*zoom,
            (Y/2)-(YY/2)*zoom,
            XX * zoom + zoom,
            YY * zoom + zoom
        );

        coords.forEach((v) => {
            ctx.fillStyle = '#DB5461';
            ctx.fillRect(v.x * zoom + o.x, v.y * zoom + o.y, 1 * zoom, 1 * zoom);
        });

        const stream = canvas.createPNGStream()
        const out = createWriteStream(__dirname + `/13/${frame.toString().padStart(3, '0')}.png`);
        stream.pipe(out);
        
        out.on('error', (a) => console.log(a));
        
        await new Promise(resolve => out.on("finish", resolve));

        frame++;
    }

    const encoder = new GifEncoder(canvas.width, canvas.height);

    const stream = pngFileStream(__dirname + "/13/*.png")
        .pipe(encoder.createWriteStream({ repeat: -1, delay: 400, quality: 10}))
        .pipe(createWriteStream(__dirname + '/13.gif'));

    await new Promise(resolve => stream.on('finish', resolve));

    rmSync(__dirname + '/13', { recursive: true });
};