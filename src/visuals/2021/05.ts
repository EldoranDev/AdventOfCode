import { createCanvas } from 'canvas';
import { createWriteStream } from 'fs';
import { } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';

export default async function (input: string[], { logger }: Context) {
    let highestX = 0;
    let highestY = 0;

    let lines = input.map((line) => {
        let split = line.split('->');

        let [ sX, sY ] = split[0].trim().split(',').map(s => parseInt(s));
        let [ eX, eY ] = split[1].trim().split(',').map(s => parseInt(s));
        
        highestX = Math.max(highestX, sX, eX);
        highestY = Math.max(highestY, sY, eY);

        return {
            start: new Vec2(sX, sY),
            end: new Vec2(eX, eY),
        };
    });

    const canvas = createCanvas(highestX, highestY);
    const ctx = canvas.getContext('2d');

    ctx.fillRect(0, 0, highestX, highestY);

    for (let line of lines) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 0, 0, 0.4);`
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);

        ctx.stroke();
    }

    const stream = canvas.createPNGStream()
    const out = createWriteStream(__dirname + '/05.png');
    stream.pipe(out);
    
    await new Promise(resolve => out.on("finish", resolve));
};