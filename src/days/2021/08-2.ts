import { } from '@lib/input';
import { Context } from '@app/types';
import { brotliCompress } from 'zlib';

export default function (input: string[], { logger }: Context) {
    let lines = input.map(l => l.split('|').map(c => c.trim().split(' ')));
    let count = 0;

    for (let line of lines) {
            let map = {
                t: [],
                m: [],
                b: [],
                tl: [],
                tr: [],
                bl: [],
                br: [],
            };

            let all = [
                ...line[0],
                ...line[1],
            ].map(e => e.split(''))

            let known = [
                ...line[0].filter(e => [2, 3, 4, 7].includes(e.length)).map(e => e.split('')),
                ...line[1].filter(e => [2, 3, 4, 7].includes(e.length)).map(e => e.split('')),
            ];

            let one = known.find(e => e.length == 2);
            let four = known.find(e => e.length == 4);
            let seven = known.find(e => e.length == 3);

            map['tr'].push(...one);
            map['br'].push(...one);
            map['m'].push(
                ...four.filter(e => !one.includes(e))
            );

            map['tl'].push(
                ...four.filter(e => !one.includes(e))
            );

            map['t'].push(
                ...seven.find(e => !one.includes(e))
            );

            let three = all.find(e => {
                if (e.length !== 5) {
                    return false;
                }

                for (let c of one) {
                    if (!e.includes(c)) {
                        return false;
                    }
                }

                return true;
            });

            map['b'].push(
                ...three
                    .filter(e => !one.includes(e))
                    .filter(e => !map['m'].includes(e))
                    .filter(e => !map['t'].includes(e))
            )

            map['m'] = map['m'].filter(e => three.includes(e));
            map['tl'] = map['tl'].filter(e => !map['m'].includes(e));

            let zero = all.find((e) => {
                if (e.length != 6) {
                    return false;
                }

                for (let c of one) {
                    if (!e.includes(c)) {
                        return false;
                    }
                }


                for (let c of map['m']) {
                    if (e.includes(c)) {
                        return false;
                    }
                }

                return true;
            });

            map['bl'].push(
                ...zero
                    .filter(e => !one.includes(e))
                    .filter(e => !map['t'].includes(e))
                    .filter(e => !map['b'].includes(e))
                    .filter(e => !map['tr'].includes(e))
            );

            let five = all.find(e => {
                if (e.length !== 5) {
                    return false;
                }
                
                return e.includes(map['tl'][0]);
            });

            map['br'] = map['br'].filter(e => five.includes(e));
            map['tr'] = map['tr'].filter(e => !map['br'].includes(e));
            map['bl'] = map['bl'].filter(e => !map['tl'].includes(e));

            const dict = {
                [
                    [
                        map['t'][0],
                        map['tr'][0],
                        map['br'][0],
                        map['b'][0],
                        map['tl'][0],
                        map['bl'][0],
                    ].sort().join('')
                ]: 0,
                [
                    [
                        map['tr'][0],
                        map['br'][0],
                    ].sort().join('')
                ]: 1,
                [
                    [
                        map['t'][0],
                        map['tr'][0],
                        map['m'][0],
                        map['bl'][0],
                        map['b'][0],
                    ].sort().join('')
                ]: 2,
                [
                    [
                        map['t'][0],
                        map['tr'][0],
                        map['m'][0],
                        map['br'][0],
                        map['b'][0],
                    ].sort().join('')
                ]: 3,
                [
                    [
                        map['tr'][0],
                        map['tl'][0],
                        map['m'][0],
                        map['br'][0],
                    ].sort().join('')
                ]: 4,
                [
                    [
                        map['t'][0],
                        map['tl'][0],
                        map['m'][0],
                        map['br'][0],
                        map['b'][0],
                    ].sort().join('')
                ]: 5,
                [
                    [
                        map['t'][0],
                        map['tl'][0],
                        map['m'][0],
                        map['br'][0],
                        map['bl'][0],
                        map['b'][0],
                        
                    ].sort().join('')
                ]: 6,
                [
                    [
                        map['tr'][0],
                        map['br'][0],
                        map['t'][0],
                    ].sort().join('')
                ]: 7,
                [
                    [
                        map['t'][0],
                        map['tr'][0],
                        map['br'][0],
                        map['m'][0],
                        map['b'][0],
                        map['tl'][0],
                        map['bl'][0],
                    ].sort().join('')
                ]: 8,
                [
                    [
                        map['t'][0],
                        map['tr'][0],
                        map['br'][0],
                        map['m'][0],
                        map['b'][0],
                        map['tl'][0],
                    ].sort().join('')
                ]: 9,
            }

            let output = "";

            for (let on of line[1]) {
                output += dict[
                    on.split('').sort().join('')
                ];
            }

            count += parseInt(output);
        }

    return count;
};