import { flipHorizontal } from '@lib/array2D';

describe('Array2D: flipHorizontal', () => {
    it ('should flip array successfully', () => {
        const M = [
            [0, 1],
            [2, 3]
        ];

        expect(flipHorizontal(M)).toEqual([
            [1, 0],
            [3, 2]
        ]);
    })

    it ('should equal identity when applied twice', () => {
        const M = [
            [0, 1],
            [2, 3],
        ];

        expect(flipHorizontal(flipHorizontal(M))).toEqual(M);
    });
});