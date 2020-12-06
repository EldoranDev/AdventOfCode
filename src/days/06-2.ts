export default function (input: string[]) {
    let count = 0;
    let group: Set<string> = new Set<string>();
    
    for (let i = 0; i < input.length; i++) {
        const line = input[i].trim();

        if (line === '') {
            count += group.size;
            group = new Set<string>(
                input[++i].split('').filter(q => q !== '\r')
            );

            continue;
        }

        for (let q of group.keys()) {
            if (!line.includes(q)) {
                group.delete(q);
            }
        }
    }

    return count;
};