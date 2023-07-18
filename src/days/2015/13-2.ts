import { } from '@lib/input';
import { Context } from '@app/types';
import { permutator } from '@lib/array';

const EXTRACTOR = /([a-zA-Z]*) would (gain|lose) (\d*) happiness units by sitting next to ([a-zA-Z]*)./;

const RULES: Map<string, Map<string, number>> = new Map();

let HIGHEST_POTENTIAL = 0;
let HIGHEST = 0;

export default function (input: string[], { logger }: Context) {
    for (const line of input) {
        const [, person, gainOrLose, value, nextTo] = EXTRACTOR.exec(line)!;

        const change = parseInt(value, 10) * (gainOrLose === 'gain' ? 1 : -1);

        if (!RULES.has(person)) {
            RULES.set(person, new Map());

            RULES.get(person)!.set('Me', 0);
        }

        RULES.get(person)!.set(nextTo, change);

        if (change > HIGHEST_POTENTIAL) {
            HIGHEST_POTENTIAL = change;
        }
    }

    const people = Array.from([...RULES.keys(), 'Me']);

    RULES.set('Me', new Map());

    people.forEach((person) => {
        RULES.get('Me')!.set(person, 0);
    });

    permutator(people).forEach((permutation) => {
        let total = 0;

        for (let i = 0; i < permutation.length; i++) {
            const person = permutation[i];
            const nextPerson = permutation[(i + 1) % permutation.length];

            const value = getChange(person, nextPerson);

            total += value;
        }

        if (total > HIGHEST) {
            HIGHEST = total;
        }
    });

    return HIGHEST;
}

function getChange(person: string, nextTo: string): number {
    return RULES.get(person)!.get(nextTo)! + RULES.get(nextTo)!.get(person)!;
}
