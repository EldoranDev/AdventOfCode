import { describe, it, expect } from "vitest";

import { unique } from ".";

describe("Array: Unique", () => {
    it("Array stays the same when empty", () => {
        const A = [];

        const a = unique(A);

        expect(a.length).toBe(A.length);
    });

    it("Already unique arrays stays the same", () => {
        const A = ["A", "B", "C", "D"];
        const a = unique(A);

        expect(a.length).toBe(A.length);
    });

    it("returns intersecting values", () => {
        const A = ["a", "b", "a"];

        const a = unique(A);

        expect(a.length).toBe(2);
    });
});
