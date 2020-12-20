export default function flipVertical<T>(mat: T[][]): T[][] {
    return [...mat].reverse();
}