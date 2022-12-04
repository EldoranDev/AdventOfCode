export default function group<T>(array: T[], groupSize: number): T[][] {
    if (array.length % groupSize !== 0) {
        throw new Error(`Array can not be grouped into groups of given size ${groupSize}`);
    }

    if (array.length < groupSize) {
        throw new Error(`Array to small to distribute into groups of ${groupSize}`);
    }

    if (array.length === groupSize) {
        return [array];
    }

    const groups: T[][] = [];
    let group = 0;

    for (const el of array) {
        if (groups[group] === undefined) {
            groups[group] = [];
        }

        groups[group].push(el);

        if (groups[group].length === groupSize) {
            group++;
        }
    }

    return groups;
}
