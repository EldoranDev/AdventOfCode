import * as input from '@lib/input';

describe('Input', () => {
    it('can map numbers successfull', () => {
        const result = input.mapToNumber(['1', '2', '3', '4', '5']);

        expect(result.length).toBe(5);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('can detect groups in input', () => {
        const result = input.getLineGroups(["A", "B", "C", "", "D", "E", "F", "", "G", "H", "I"]);

        expect(result.length).toBe(3);

    });
}); 