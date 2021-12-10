import { Heap, Node } from './Heap';

export class MinHeap<T> extends Heap<T> {
    public push(value: T, prio: number) {
        this.heap.push(new Node(value, prio));

        let index = this.heap.length - 1;

        while (index !== 0 && this.heap[index].prio < this.heap[Heap.parent(index)].prio) {
            this.swap(index, MinHeap.parent(index));
            index = Heap.parent(index);
        }
    }

    protected rebalance(index: number): void {
        const left = Heap.leftChild(index);
        const right = Heap.rightChild(index);

        let smallest = index;

        if (left < this.heap.length && this.heap[smallest].prio > this.heap[left].prio) {
            smallest = left;
        }

        if (right < this.heap.length && this.heap[smallest].prio > this.heap[right].prio) {
            smallest = right;
        }

        if (index !== smallest) {
            this.swap(index, smallest);
            this.rebalance(smallest);
        }
    }
}
