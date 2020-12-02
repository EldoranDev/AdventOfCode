export default function (input: string[]) {
    const lines = input.filter((line) => {
        const parts = line.split(' ')

        const [ min, max ] = parts[0].split('-').map(n => Number(n));

        const letter = parts[1].substr(0, 1);

        const letters: Record<string, number> =  {};

        for (let i = 0; i < parts[2].length; i++) {
            const char = parts[2].charAt(i);

            if (letters[char] === undefined) {
                letters[char] = 0;
            }

            letters[char]++;
        }
        return letters[letter] >= min && letters[letter] <= max;
    });

    return lines.length;
};