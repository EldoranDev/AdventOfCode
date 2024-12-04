export default function (input: string[]) {
    type slope = { x: number; y: number };

    const slopes: slope[] = [
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 5, y: 1 },
        { x: 7, y: 1 },
        { x: 1, y: 2 },
    ];

    return slopes.reduce((carry, s) => carry * checkSlope(s.x, s.y, input), 1);
}

function checkSlope(_x: number, _y: number, input: string[]): number {
    let count = 0;

    let x = _x;

    for (let y = _y; y < input.length; y += _y) {
        if (input[y].charAt(x % input[y].length) === "#") {
            count++;
        }

        x += _x;
    }

    return count;
}
