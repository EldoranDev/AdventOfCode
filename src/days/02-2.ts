export default function (input: string[]) {
    const lines = input.filter((line) => {
        const parts = line.split(' ')

        const [ a, b ] = parts[0].split('-').map(n => Number(n));

        const letter = parts[1].substr(0, 1);

        const posA = parts[2].charAt(a-1);
        const posB = parts[2].charAt(b-1);

        return (
            posA !== posB
            && (
                posA === letter
                || posB === letter 
            )
        );
    });

    return lines.length;
};