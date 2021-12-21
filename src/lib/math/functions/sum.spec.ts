import { sum } from './sum';

describe('Math function: Sum', () => {
    it('Sums up correctly', () => {
        expect(sum(1, 2, 3)).toBe(6);
    });
});