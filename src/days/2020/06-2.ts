import { getLineGroups } from '@lib/input';

export default function (input: string[]) {
    return getLineGroups(input).reduce((count, group) => {
        const anwers = new Set<string>(group[0].split('').filter(q => q !== '\r'));

        for (let i = 1; i < group.length; i++) {
            for (let q of anwers.keys()) {
                if (!group[i].includes(q)) {
                    anwers.delete(q);
                }
            }
        }

        return count + anwers.size;
    }, 0);
};