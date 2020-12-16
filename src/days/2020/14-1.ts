import { } from '@lib/input';

const R_MEM = /mem\[([0-9]*)\] = ([0-9]*)/;

export default function (input: string[]) {
    let mask: string = "";
    let mem: number[] = [];

    for (let i = 0; i < input.length; i++) {
        if (input[i].includes('mask')) {
            mask = input[i].replace('mask = ', '');
        } else {
            let match = R_MEM.exec(input[i]);
            let bin = Number(match[2]).toString(2).padStart(mask.length, '0');
            
            let applied = "";

            for (let j = 0; j < mask.length; j++) {
                if (mask.charAt(j) === 'X') {
                    applied += bin.charAt(j);
                } else {
                    applied += mask.charAt(j);
                }
            }

            mem[Number(match[1])] = Number.parseInt(applied, 2);
        }
    }

    return mem.reduce((sum, m) => sum + m, 0);
};