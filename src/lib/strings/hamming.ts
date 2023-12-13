export function hammingDistance(a: string, b: string): number {
    let distance = 0;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            distance++;
        }
    }

    return distance;
}
