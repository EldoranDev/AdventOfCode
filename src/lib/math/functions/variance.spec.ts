import { describe, it, expect } from "vitest";

import { variance } from "./variance";

describe("Math function: Variance", () => {
    it("Sums up correctly", () => {
        expect(variance(1, 4, 10)).toBe(14);
    });
});
