import { mapToNumber } from '@lib/input';
import { Context } from '@app/types';
import { create } from '@lib/array2d';
import { Vec2 } from '@lib/math';

export default function (input: string[], { logger }: Context) {
    const map: number[][] = [];

    for (const line of input) {
        map.push(mapToNumber(line.split('')));
    }

    const pos = [
        new Vec2(0, 1),
        new Vec2(0, -1),
        new Vec2(1, 0),
        new Vec2(-1, 0),
    ];

    let sum = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let valid = true;
            for (const off of pos) {
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
                sum += map[y][x] + 1;
            }
        }
    }

    return sum;
};