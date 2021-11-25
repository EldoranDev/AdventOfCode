import chineseRemainder from './chineseRemainder';

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
});