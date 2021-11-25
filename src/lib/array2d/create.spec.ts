import create from "@lib/array2d/create";

describe('Array2D: create', () => {
    it('should create in correct dimensions', () => {
        const result = create(4, 5);

        expect(result.length).toBe(5);
        expect(result[0].length).toBe(4);
    });
});