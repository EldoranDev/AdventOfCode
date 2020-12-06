export default function (input: string[]) {
    let count = 0;

    let group: Set<string> = new Set<string>();
    
    for (let line of input) {
        if (line.trim() === '') {
            count += group.size;
            group = new Set<string>();
            continue;
        }

        line.split('').filter(q => q !== '\r').forEach((q) => group.add(q));
    }

    return count + group.size;
};