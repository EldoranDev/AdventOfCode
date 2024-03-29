export type Grid2D<T> = T[][];

export default function create<T>(x: number, y: number, initial: T = undefined): Grid2D<T> {
    const array: T[][] = Array.from({ length: y });

    for (let row = 0; row < y; row++) {
        array[row] = Array.from({ length: x });

        if (initial !== undefined) {
            array[row].fill(initial);
        }
    }

    return array;
}
