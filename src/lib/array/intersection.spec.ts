import { intersection } from '.';

describe('Array: Intersection', () => {
    it('returns empty if empty array passed', () => {
        const A = [];
        const B = ['a', 'b', 'c'];

        const inter = intersection(A, B);

        expect(inter.length).toBe(0);
    });

    it('returns empty if nothing passed', () => {
        const inter = intersection();

        expect(inter.length).toBe(0);
    });

    it('returns intersecting values', () => {
        const A = ['a', 'b', 'c'];
        const B = ['b', 'c', 'd'];
        const C = ['c', 'd', 'e'];

        const inter = intersection(A, B, C);

        expect(inter.length).toBe(1);
    });
});
