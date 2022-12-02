import { describe, it, expect } from 'vitest';

import { getColumn } from '.';

describe('Array2D: getColumn', () => {
    it('should return undefined when out of bounds', () => {
        const M = [
            [0, 1],
            [2, 3],
        ];

        expect(getColumn(M, 2)).toBe(undefined);
    });

    it('should return correct column', () => {
        const M = [
            [0, 1],
            [2, 3],
        ];

        expect(getColumn(M, 0)).toEqual([0, 2]);
    });
});
