export function mapToNumber (input: string[]) {
    return input.map((line) => Number(line));
}

export function getLineGroups (input: string[]) {
    const groups: string[][] = [];
    
    input.push('');

    let group: string[] = [];
    
    for (let line of input) {
        if (line.trim() === '') {
            groups.push(group);
            group = [];
            continue;
        }

        group.push(line);
    }
 
    return groups;
}