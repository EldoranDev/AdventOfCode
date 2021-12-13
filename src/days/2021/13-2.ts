import { getLineGroups, mapToNumber } from '@lib/input';
import { Context } from '@app/types';
import { Vec2 } from '@lib/math';
import { create } from '@lib/array2d';
import { GeneralSet } from '@lib/collections';

const Y_FOLD = /fold along y=([0-9]*)/;
const X_FOLD = /fold along x=([0-9]*)/;

export default function (input: string[], { logger }: Context) {
    let coords = new GeneralSet<Vec2>();

    const groups = getLineGroups(input);
    let maxX = 0;
    let maxY = 0;

    for (let line of groups[0]) {
        let [ x, y ] = mapToNumber( line.split(','));
        
        if (x > maxX) {
            maxX = x;
        }

        if (y > maxY) {
            maxY = y;
        }

        coords.add(new Vec2(x, y));
    }

    logger.debug(`Got ${coords.size} Points`);

    for (let i = 0; i < groups[1].length; i++) {

        let fold = Y_FOLD.exec(groups[1][i]);
        if (fold !== null) {
            coords = foldY(coords, Number(fold[1]));
        } else {
            fold = X_FOLD.exec(groups[1][i])
            coords = foldX(coords, Number(fold[1]))
        }
    }
    
    let biggestX = 0;
    let biggestY = 0;

    coords.forEach((vec) => {
        if (vec.x > biggestX) {
            biggestX = vec.x;
        }

        if (vec.y > biggestY) {
            biggestY = vec.y;
        }
    });
    let output = '\n';

    for (let y = 0; y < biggestY+1; y++) {
        for (let x = 0; x < biggestX+1; x++) {
            output += coords.has(new Vec2(x, y)) ? '#' : '.';
        }

        output += '\n';
    }

    logger.info(output);
};

function foldX(set: GeneralSet<Vec2>, fold: number): GeneralSet<Vec2> {
    let newSet = new GeneralSet<Vec2>();

    set.forEach((v) => {
        if (v.x < fold) {
            newSet.add(v);
        } else {
            newSet.add(new Vec2(2 * fold - v.x, v.y));
        }
    });

    return newSet;
}

function foldY(set: GeneralSet<Vec2>, fold: number): GeneralSet<Vec2> {
    let newSet = new GeneralSet<Vec2>();

    set.forEach((v) => {
        if (v.y < fold) {
            newSet.add(v);
        } else {
            newSet.add(new Vec2(v.x, 2 * fold - v.y));
        }
    });

    return newSet;
}