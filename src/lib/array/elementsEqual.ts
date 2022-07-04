export default function elementsEqual<T>(a: T[]): boolean {
    if (a.length === 0 || a.length === 1) {
        return true;
    }

    const first = a[0];

    for (let i = 1; i < a.length; i++) {
        if (a[i] !== first) {
            return false;
        }
    }

    return true;
}
