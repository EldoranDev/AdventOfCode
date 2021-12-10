export default function rotateClockwise<T>(mat: T[][]): T[][] {
    const M = mat.length;
    const N = mat[0].length;

    const nd: T[][] = [];

    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            if (nd[c] === undefined) {
                nd[c] = [];
            }

            nd[c][M - 1 - r] = mat[r][c];
        }
    }

    return nd;
}
