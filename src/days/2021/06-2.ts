import { mapToNumber } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const fish = mapToNumber( input[0].split(','));

    let map = new Map<number, number>();

    for (let i = 0; i <= 8; i++) {
        map.set(i, 0);
    }
    
    for (const f of fish) {
        map.set(f, map.get(f) + 1);
    }
    
    for (let i = 0; i < 256; i++) {
        const nmap = new Map();

        for (let i = 0; i <= 8; i++) {
            nmap.set(i, 0);
        }

        for (const e of map.entries()) {
            if (e[0] === 0) {
                nmap.set(6, nmap.get(6) + e[1]);
                nmap.set(8, nmap.get(8) + e[1]);
            } else {
                nmap.set(e[0]-1, nmap.get(e[0]-1) + e[1]);
            }
        }

        map = nmap;
    }
    return [...map.entries()].reduce((last, curr) => last + curr[1], 0);
};