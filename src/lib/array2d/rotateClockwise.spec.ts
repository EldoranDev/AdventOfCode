import { describe, it, expect } from "vitest";

import { rotateClockwise } from ".";

describe("Array2D: rotateClockwise", () => {
    it("should rotate correctly", () => {
        const M = [
            [0, 1],
            [2, 3],
        ];

        expect(rotateClockwise(M)).toEqual([
            [2, 0],
            [3, 1],
        ]);
    });

    it("should equal identity when used 4 times", () => {
        const M = [
            [0, 1],
            [2, 3],
        ];

        let N = [...M];

        for (let i = 0; i < 4; i++) {
            N = rotateClockwise(N);
        }

        expect(N).toEqual(M);
    });
});
