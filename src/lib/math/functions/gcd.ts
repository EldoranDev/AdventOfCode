/* eslint-disable no-param-reassign */
export function GCD(a: number, b: number): number {
    if (a === 0) return Math.abs(b);
    if (b === 0) return Math.abs(a);

    do {
        const h = a % b;
        a = b;
        b = h;
    } while (b !== 0);

    return Math.abs(a);
}
