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
    let grp = 0;

    for (const el of array) {
        if (groups[grp] === undefined) {
            groups[grp] = [];
        }

        groups[grp].push(el);

        if (groups[grp].length === groupSize) {
            grp++;
        }
    }

    return groups;
}
