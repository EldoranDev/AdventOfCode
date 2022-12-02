import { describe, it, expect } from 'vitest';

import { MaxHeap } from '.';

describe('MaxHeap', () => {
    it('should add correctly', () => {
        const heap = new MaxHeap<string>();

        heap.push('three', 3);
        heap.push('one', 1);
        heap.push('four', 4);
        heap.push('two', 2);

        expect(heap.peek()).toBe('four');
    });

    it('should return correct', () => {
        const heap = new MaxHeap<string>();

        heap.push('three', 3);
        heap.push('one', 1);
        heap.push('two', 2);
        heap.push('four', 4);

        expect(heap.shift()).toBe('four');
        expect(heap.peek()).toBe('three');
    });
});
