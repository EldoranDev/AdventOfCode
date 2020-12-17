import Vec3 from '@lib/math/vec3';

describe('Vec2', () => {
    it('should init as Zero', () => {
        const v = new Vec3();

        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
        expect(v.z).toBe(0);
    });

    it ('should add component wise', () => {
        const a = new Vec3(1, 2, 3);
        const b = new Vec3(3, 4, 5);

        const res = Vec3.add(a, b);

        expect(res.x).toBe(4);
        expect(res.y).toBe(6);
        expect(res.z).toBe(8);
    });
});