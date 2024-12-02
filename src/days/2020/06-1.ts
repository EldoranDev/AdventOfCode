import { getLineGroups } from '@lib/input';

export default function (input: string[]) {
    return getLineGroups(input).reduce((count, group) => {
        const anwers = new Set<string>();

        for (const line of group) {
            line.split('').filter(q => q !== '\r').forEach((q) => anwers.add(q));
        }

        return count + anwers.size;
    }, 0);
};