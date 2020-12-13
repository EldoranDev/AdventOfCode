import chineseRemainder from '../../../../src/lib/math/functions/chineseRemainder';

describe('Math Function: chineseRemainer', () => {
    it('should pass sample test', () => {
        expect(true).toBe(true);
    });

    it ('should solve original problem', () => {
        const answer = chineseRemainder([3, 5, 7], [2, 3, 2]);

        expect(answer).toBe(23);
    });

    it ('should solve wikipedia sample', () => {
        const answer = chineseRemainder([3, 4, 5], [2, 3, 2]);

        expect(answer).toBe(47);
    });

    it ('should solve wikipedia sample', () => {
        const answer = chineseRemainder([2, 3, 4, 5, 6, 7], [1, 1, 1, 1, 1, 0]);

        expect(answer).toBe(47);
    });
});