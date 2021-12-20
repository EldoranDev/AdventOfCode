import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';
import { create } from '@lib/array2d';

export default function (input: string[], { logger }: Context) {
    const [ [ ALGO ], INPUT] = getLineGroups(input);
    const ENHANCES = 2;
    const BUFFER = 5;

    let map = create(INPUT[0].length, INPUT.length, false);

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x] = INPUT[y][x] === '#';
        }
    }

    let infinity = false;

    for (let e = 0; e < ENHANCES; e++) {
        console.log(`INFINITY: ${infinity ? '#' : '.'}`);

        let input = create(map[0].length + BUFFER*2, map.length + BUFFER*2, infinity);
        let newMap = create(map[0].length + BUFFER*2, map.length + BUFFER*2, infinity);

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                input[y+BUFFER][x+BUFFER] = map[y][x];
            }
        }

        for (let y = 0; y < newMap.length; y++) {
            for (let x = 0; x < newMap[y].length; x++) {
                let index = getNumber(
                    x,
                    y, 
                    input,
                    infinity
                );
                
                newMap[y][x] = ALGO[index] === '#'
            }
        }

        map = newMap;
        infinity = ALGO[getNumber(-BUFFER, -BUFFER, input, infinity)] === '#';
    }

    let output = '\n';
    let result = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            output += map[y][x] ? '#' : '.';
            result += map[y][x] ? 1 : 0;
        }
        output += '\n';
    }

    logger.debug(output);

    return result;
};

function getNumber(xo: number, yo: number, map: boolean[][], infinity: boolean): number {
    let number = "";

    for (let y = yo - 1; y <= yo+1; y++) {
        for (let x = xo - 1; x <= xo+1; x++) {
            if (x < 0 || y < 0 || y >= map.length || x >= map[y].length) {
                number += infinity ? '1' : '0';
            } else {
                number += map[y][x] ? '1' : '0';
            }
        }
    }

    return parseInt(number, 2);
}