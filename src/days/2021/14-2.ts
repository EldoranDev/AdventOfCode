import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';


let ROUNDS = 40;

export default function (input: string[], { logger }: Context) {
    
    let instr = new Map<string, string>();


    let [ START, INSTR ] = getLineGroups(input);

    let start = START[0];

    INSTR.forEach((line) => {
        const [A, B] = line.split('->').map((l) => l.trim());

        instr.set(A, B);
    });

    let letters = new Map<string, number>();
    let map = new Map<string, number>();

    for (let i = 0; i < start.length; i++) {
        let combi = start[i] + start[i+1];
        let char = start[i];

        if (!letters.has(char)) {
            letters.set(char, 0);
        }

        if (!map.has(combi) && i < start.length-1) {
            map.set(combi, 0);
        }

        letters.set(char, letters.get(char) + 1);

        if (i < start.length - 1) {
            map.set(combi, map.get(combi) + 1);
        }
    }
    
    for (let r = 0; r < ROUNDS; r++) {
        let newMap = new Map<string, number>();
        
        for (let combi of map.entries()) {
            const [A, B] = combi[0].split('');

            if (!instr.has(combi[0])) {
                continue;
            }
            let newLetter = instr.get(combi[0]);

            if (!letters.has(newLetter)) {
                letters.set(newLetter, 0);
            }

            letters.set(newLetter, letters.get(newLetter) + combi[1]);
            
            if (!newMap.has(A + newLetter)) {
                newMap.set(A + newLetter, 0);
            }

            if (!newMap.has(newLetter + B)) {
                newMap.set(newLetter + B, 0);
            }

            newMap.set(A + newLetter, newMap.get(A+ newLetter) + combi[1]);
            newMap.set(newLetter + B, newMap.get(newLetter + B) + combi[1]);
        }

        map = newMap;
    }

    let countValues = [...letters.values()];

    countValues.sort((a, b) => a - b);

    return countValues[countValues.length-1] - countValues[0];

};