export default function (input: string[]) {
    return (
        checkSlope(1, 1, input) *
        checkSlope(3, 1, input) *
        checkSlope(5, 1, input) *
        checkSlope(7, 1, input) *
        checkSlope(1, 2, input)
    );
};

function checkSlope(_x: number, _y: number, input: string[]): number {
    let count = 0;

    let x = _x;

    for (let y = _y; y < input.length; y += _y) {
        if (input[y].charAt(x % input[y].length) === '#') {
            count++;
        }

        x += _x;
    }

    return count;
}