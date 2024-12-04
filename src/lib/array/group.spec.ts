import { describe, it, expect } from "vitest";
import { group } from ".";

describe("Array: Group", () => {
    it("fails when sizes do not match", () => {
        const A = ["a", "b", "c", "d"];

        expect(() => {
            group(A, 3);
        }).toThrow();
    });

    it("fails when array to small to group", () => {
        const A = ["a", "b", "c", "d"];

        expect(() => {
            group(A, 5);
        }).toThrow();
    });

    it("groups the array sucessful", () => {
        const A = ["a", "b", "c", "d", "e", "f"];
        const groups = group(A, 2);

        expect(groups.length).toBe(3);
    });
});
