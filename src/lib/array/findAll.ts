export default function findAllIndices<T>(
    val: T,
    array: Array<T>,
): Array<number> {
    const matches = [];

    let lastIndex = 0;

    while (true) {
        const i = array.indexOf(val, lastIndex);

        if (i === -1) {
            return matches;
        }
        matches.push(i);
        lastIndex = i + 1;
    }
}
