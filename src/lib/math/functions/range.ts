export function range(size: number, startAt: number): number[] {
    return [...Array(size).keys()].map((i) => i + startAt);
}
