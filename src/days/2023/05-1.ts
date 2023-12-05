import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';

interface Range {
    from: number;
    to: number;

    length: number;
}

type Group = Array<Range>;

export default function (input: string[], { logger }: Context) {
    const groups = getLineGroups(input);

    const seeds = groups.shift()[0].split(':')[1].trim().split(' ').map(Number);

    const maps = groups.map((group): Group => {
        const ranges: Range[] = [];
        group.shift();

        group.forEach((line) => {
            const [to, from, length] = line.split(' ').map(Number);

            ranges.push({
                from,
                to,
                length,
            });
        });

        return ranges;
    });

    maps.forEach((map) => {
        for (let i = 0; i < seeds.length; i++) {
            const seed = seeds[i];
            for (let j = 0; j < map.length; j++) {
                if (seed >= map[j].from && seed < map[j].from + map[j].length) {
                    seeds[i] = map[j].to + (seed - map[j].from);
                    break;
                }
            }
        }
    });

    return Math.min(...seeds);
}
