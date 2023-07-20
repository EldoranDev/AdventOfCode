import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';

type Replacement = {
    from: string;
    to: string;
};

const TARGET = 'e';
const REPLACEMENTS: Array<Replacement> = [];

export default function (input: string[], { logger }: Context) {
    const [instructions, [start]] = getLineGroups(input);

    for (const instruction of instructions) {
        const [from, to] = instruction.split(' => ');

        REPLACEMENTS.push({ from, to });
    }

    REPLACEMENTS.sort(() => Math.random() - 0.5);

    let target = start;
    let steps = 0;

    while (target !== TARGET) {
        let replaced = false;
        for (const { from, to } of REPLACEMENTS) {
            const index = target.indexOf(to);

            if (index !== -1) {
                steps++;
                target = target.slice(0, index) + from + target.slice(index + to.length);

                replaced = true;
                break;
            }
        }

        if (replaced) {
            continue;
        }

        // Restart searching
        REPLACEMENTS.sort(() => Math.random() - 0.5);
        target = start;
        steps = 0;

        console.log('Shuffeling replacements, and restarting');
    }

    return steps;
}
