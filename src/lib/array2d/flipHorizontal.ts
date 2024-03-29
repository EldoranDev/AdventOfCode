export default function flipHorizontal<T>(mat: T[][]): T[][] {
    const nm: T[][] = [];

    for (let r = 0; r < mat.length; r++) {
        nm[r] = [...mat[r]].reverse();
    }

    return nm;
}
