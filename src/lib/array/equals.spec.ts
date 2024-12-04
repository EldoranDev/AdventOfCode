import { describe, it, expect } from "vitest";

import { equals } from ".";

describe("Array: Equals", () => {
    it("should fail for arrays of different size", () => {
        const A = [0, 0, 0, 0];
        const B = [0, 0, 0, 0, 0, 0];

        expect(equals(A, B)).toBe(false);
    });

    it("should work for equal ararys", () => {
        const A = [0, 1, 2, 3];
        const B = [0, 1, 2, 3];

        expect(equals(A, B)).toBe(true);
    });

    it("shuld fail for unequal arrays", () => {
        const A = [0, 1, 2, 3];
        const B = [0, 1, 2, 4];

        expect(equals(A, B)).toBe(false);
    });
});
