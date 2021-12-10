export function mapToNumber(input: string[]): number[] {
    return input.map((line) => Number(line));
}

export function getLineGroups(input: string[]): string[][] {
    const groups: string[][] = [];

    input.push('');

    let group: string[] = [];

    for (const line of input) {
        if (line.trim() === '') {
            groups.push(group);
            group = [];
            continue;
        }

        group.push(line);
    }

    return groups;
}
