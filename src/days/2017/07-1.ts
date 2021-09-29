import { } from '@lib/input';

type Disk = {
    id: string,
    top: Disk[],
    bottom: Disk,
};

export default function (input: string[]) {
    let map = new Map<string, Disk>();

    for (let line of input) {
        let parts = line.split('->');

        const current = parts[0].split(' ')[0].trim();

        if (!map.has(current)) {
            map.set(current, { id: current, bottom: null, top: [] })
        }

        if (parts.length === 1) {
            continue;
        }

        const top = parts[1].split(',').map(p => p.trim());
        const disk = map.get(current);

        for (let t of top) {
            if (!map.has(t)) {
                map.set(t, { id: t, bottom: null, top: [] });
            }

            const d = map.get(t);

            d.bottom = disk;
            disk.top.push(d);
        }
    }

    const bottom = [...map.values()].find((d) => d.bottom === null);

    return bottom.id;
};

