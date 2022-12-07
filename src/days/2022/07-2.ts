import { } from '@lib/input';
import { Context } from '@app/types';
import { sum } from '@lib/math/functions';

class Entry {
    public children: Map<string, Entry> | null;

    private cachedSize: number | null = null;

    constructor(
        public parent: Entry | null,
        public name: string,
        public type: 'dir' | 'file',
        public size: number = 0,
    ) {
        if (type === 'dir') {
            this.children = new Map<string, Entry>();
        }
    }

    public getSize(): number {
        if (this.cachedSize !== null) {
            return this.cachedSize;
        }

        switch (this.type) {
            case 'file':
                return this.size;
            case 'dir':
                this.cachedSize = [
                    ...this.children.values(),
                ].reduce((prev, c) => prev + c.getSize(), 0);

                return this.cachedSize;
            default:
                throw new Error('Undefined Entry type');
        }
    }
}

export default function (input: string[], { logger }: Context) {
    const FILESYSTEM = 70000000;
    const REQUIRED = 30000000;

    const root: Entry = new Entry(null, '/', 'dir');
    let current: Entry = root;
    const dirs: Array<Entry> = [];

    for (let i = 1; i < input.length; i++) {
        const [A, B, C] = input[i].split(' ');

        switch (A) {
            case '$':
                if (B === 'cd') {
                    if (C === '..') {
                        current = current.parent;
                    } else {
                        current = current.children.get(C);
                    }
                }
                break;
            case 'dir':
                if (!current.children.has(B)) {
                    current.children.set(B, new Entry(current, B, 'dir'));
                    dirs.push(current.children.get(B));
                }
                break;
            default:
                current.children.set(B, new Entry(current, B, 'file', Number(A)));
                break;
        }
    }

    const free = (FILESYSTEM - root.getSize());

    const toDelete = REQUIRED - free;

    const folders = [...dirs.filter((dir) => dir.getSize() >= toDelete)];

    return folders.sort((a, b) => a.getSize() - b.getSize())[0].getSize();
}
