import Vec2 from '@lib/math/vec2';

describe('Vec2', () => {
    it('should init as Zero', () => {
        const v = new Vec2();

        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it ('should add component wise', () => {
        const a = new Vec2(1, 2);
        const b = new Vec2(3, 4);

        const res = Vec2.add(a, b);

        expect(res.x).toBe(4);
        expect(res.y).toBe(6);
    });

    it ('should subtract component wise', () => {
        const a = new Vec2(1, 2);
        const b = new Vec2(3, 5);

        const res = Vec2.sub(a, b);

        expect(res.x).toBe(-2);
        expect(res.y).toBe(-3);
    });

    it ('should be equal if components are the same', () => {
        const a = new Vec2(1, 2);
        const b = new Vec2(1, 2);

        expect(a.equals(b)).toBe(true);
    });

    it ('should not be equal if components are differnt', () => {
        const a = new Vec2(1, 2);
        const b = new Vec2(1, 3);

        expect(a.equals(b)).toBe(false);
    });
});
