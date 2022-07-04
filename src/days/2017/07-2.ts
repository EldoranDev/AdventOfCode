import { elementsEqual } from '@lib/array';
import { } from '@lib/input';

type DiskType = {
    id: string,
    top: Disk[],
    bottom: Disk,
    weight: number,
};

class Disk {
    private ow: number|null = null;

    constructor(
        public readonly id: string,
        public top: Disk[],
        public bottom: Disk,
        public weight: number,
    ) {

    }

    get overallWeight(): number {
        if (this.ow != null) {
            return this.ow;
        }

        this.ow = this.weight

        for (let i = 0; i < this.top.length; i++) {
            this.ow += this.top[i].overallWeight;
        }

        return this.ow
    }

    get isBalanced(): boolean {
        let balanced = true;
        let weights: number[] = [];


        for (const t of this.top) {
            balanced &&= t.isBalanced
            weights.push(t.overallWeight);
        }

        return balanced
    }
}

export default function (input: string[]) {
    let map = new Map<string, Disk>();

    for (let line of input) {
        let parts = line.split('->');

        const current = parts[0].split(' ')[0].trim();

        if (!map.has(current)) {
            map.set(current, new Disk(current, [], null, 0) )
        }

        const disk = map.get(current);

        const number = parts[0].split(' ')[1];

        disk.weight = Number(number.substring(1, number.length-1));

        if (parts.length === 1) {
            continue;
        }

        const top = parts[1].split(',').map(p => p.trim());

        for (let t of top) {
            if (!map.has(t)) {
                map.set(t, new Disk(t, [], null, 0));
            }

            const d = map.get(t);

            d.bottom = disk;
            disk.top.push(d);
        }
    }

    const bottom = [...map.values()].find((d) => d.bottom === null);
    let unbalanced: Disk = null;

    try {
        checkBalanced(bottom);
    } catch (disk) {
        unbalanced = disk;
    }

    let wrong: Disk = null;
    let right: Disk = null;

    for (const d of unbalanced.top) {
        if (wrong === null) {
            wrong = d;
        } else if (wrong.overallWeight === d.overallWeight) {
            right = wrong;
            wrong = null;
        }
    }
    
    const diff = right.overallWeight - wrong.overallWeight;

    return wrong.weight + diff;
};

function checkBalanced(disk: Disk): void {

    for (const d of disk.top) {
        checkBalanced(d);
    }

    let weights = disk.top.map(d => d.overallWeight);

    if (!elementsEqual (weights)) {
        throw disk;
    }
}