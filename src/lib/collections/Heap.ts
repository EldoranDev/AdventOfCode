export class Node<T> {
    public constructor(
        public value: T,
        public prio: number,
    ) { }
}

export abstract class Heap<T> {
    protected heap: Node<T>[] = [];

    public get length() {
        return this.heap.length;
    }

    public peek(): T | null {
        return this.heap[0]?.value;
    }

    public shift(): T {
        const root = this.heap.shift();

        if (this.heap.length > 1) {
            this.heap.unshift(this.heap.pop());
            this.rebalance(0);
        }

        return root.value;
    }

    public abstract push(element: T, prio: number): void;

    protected abstract rebalance(index: number): void;

    protected swap(indexA: number, indexB: number): void {
        const tmp = this.heap[indexA];
        this.heap[indexA] = this.heap[indexB];
        this.heap[indexB] = tmp;
    }

    protected static parent(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    protected static leftChild(index: number): number {
        return index * 2 + 1;
    }

    protected static rightChild(index: number): number {
        return index * 2 + 2;
    }
}
