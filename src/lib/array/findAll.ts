export default function findAllIndices<T>(
    val: T,
    array: Array<T>,
): Array<number> {
    const matches = [];

    let lastIndex = array.indexOf(val, 0);

    while (lastIndex !== -1) {
        matches.push(lastIndex);
        lastIndex = array.indexOf(val, lastIndex + 1);
    }

    return matches;
}
