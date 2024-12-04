import { describe, it, expect } from "vitest";

import create from "./create";

describe("Array2D: create", () => {
    it("should create in correct dimensions", () => {
        const result = create(4, 5);

        expect(result.length).toBe(5);
        expect(result[0].length).toBe(4);
    });
});
