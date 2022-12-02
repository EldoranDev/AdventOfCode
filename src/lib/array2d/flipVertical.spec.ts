import { describe, it, expect } from 'vitest';

import { flipVertical } from '.';

describe('Array2D: flipVertical', () => {
    it('should flip array successfully', () => {
        const M = [
            [0, 1],
            [2, 3],
        ];

        expect(flipVertical(M)).toEqual([
            [2, 3],
            [0, 1],
        ]);
    });

    it('should equal identity when applied twice', () => {
        const M = [
            [0, 1],
            [2, 3],
        ];

        expect(flipVertical(flipVertical(M))).toEqual(M);
    });
});
