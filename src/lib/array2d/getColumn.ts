export default function getColumn<T>(mat: T[][], col: number): T[] {
    if (mat[0].length <= col) {
        return undefined;
    }

    const column: T[] = [];

    for (let i = 0; i < mat.length; i++) {
        column[i] = mat[i][col];
    }

    return column;
}
