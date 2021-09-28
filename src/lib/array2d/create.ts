export default function create<T>(x: number, y: number): T[][] {
    const array: T[][] = Array.from({ length: y });

    for (let row = 0; row < y; row++) {
        array[row] = Array.from({ length: x });
    }

    return array;
}
