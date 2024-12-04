import { Heap, Node } from "./Heap";

export class MaxHeap<T> extends Heap<T> {
    public push(value: T, prio: number) {
        this.heap.push(new Node(value, prio));

        let index = this.heap.length - 1;

        while (index !== 0 && this.heap[index].prio > this.heap[Heap.parent(index)].prio) {
            this.swap(index, MaxHeap.parent(index));
            index = MaxHeap.parent(index);
        }
    }

    protected rebalance(index: number): void {
        const left = Heap.leftChild(index);
        const right = Heap.rightChild(index);

        let biggest = index;

        if (left < this.heap.length && this.heap[biggest].prio < this.heap[left].prio) {
            biggest = left;
        }

        if (right < this.heap.length && this.heap[biggest].prio < this.heap[right].prio) {
            biggest = right;
        }

        if (index !== biggest) {
            this.swap(index, biggest);
            this.rebalance(biggest);
        }
    }
}
