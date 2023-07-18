import { describe, it, expect } from 'vitest';

import { permutator } from '.';

describe('Array: Permutator', () => {
    it('Should work for single item array', () => {
        const A = [0];
        expect(permutator(A)).toEqual([[0]]);
    });

    it('should work for simple array', () => {
        const A = [1, 2];
        expect(permutator(A)).toEqual([[1, 2], [2, 1]]);
    });

    it('should work for second simple array', () => {
        const A = [1, 2, 3];
        expect(permutator(A)).toEqual([
            [1, 2, 3],
            [1, 3, 2],
            [2, 1, 3],
            [2, 3, 1],
            [3, 1, 2],
            [3, 2, 1],
        ]);
    });
});
