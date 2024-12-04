import { describe, it, expect } from "vitest";

import { GCD } from "./gcd";

describe("Math function: GCD", () => {
    it("Detect Gratest Commong Divisor", () => {
        expect(GCD(143, 65)).toBe(13);
    });
});
