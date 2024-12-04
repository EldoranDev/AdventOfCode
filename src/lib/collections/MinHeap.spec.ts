import { describe, it, expect } from "vitest";

import { MinHeap } from ".";

describe("MinHeap", () => {
    it("should add correctly", () => {
        const heap = new MinHeap<string>();

        heap.push("three", 3);
        heap.push("one", 1);
        heap.push("four", 4);
        heap.push("two", 2);

        expect(heap.peek()).toBe("one");
    });

    it("should return correct", () => {
        const heap = new MinHeap<string>();

        heap.push("three", 3);
        heap.push("one", 1);
        heap.push("two", 2);
        heap.push("four", 4);

        expect(heap.shift()).toBe("one");
        expect(heap.peek()).toBe("two");
    });
});
