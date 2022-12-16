export default function intersect<T>(a: Array<T>, b: Array<T>): boolean {
    for (const element of a) {
        if (b.includes(element)) {
            return true;
        }
    }

    return false;
}
