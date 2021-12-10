export default function chineseRemainder(a: number[], n: number[]): number {
    const A = a.reduce((c, v) => c * v, 1);

    const Ai = [];
    const Xn = [];

    for (let i = 0; i < a.length; i++) {
        Ai[i] = A / a[i];
    }

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < Ai[i]; j++) {
            if ((j * Ai[i]) % a[i] === 1) {
                Xn[i] = j;
                break;
            }
        }
    }

    let sum = 0;

    for (let i = 0; i < a.length; i++) {
        sum += Xn[i] * n[i] * Ai[i];
    }

    while (sum - A > 0) {
        sum -= A;
    }

    return sum;
}
