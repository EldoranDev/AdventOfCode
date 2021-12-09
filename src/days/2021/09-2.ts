import { mapToNumber } from '@lib/input';
import { Context } from '@app/types';
import { create } from '@lib/array2d';
import { Vec2 } from '@lib/math';

export default function (input: string[], { logger }: Context) {
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

    let result = 1;

    for (let i = 0; i < 3; i++) {
        result *= basins[i].length;
    }

    return result;
};