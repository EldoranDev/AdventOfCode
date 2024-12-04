import {} from "@lib/input";

export default function (input: string[]) {
    let checksum = 0;

    for (const line of input) {
        const [min, max] = getMinMax(line);

        checksum += max - min;
    }

    return checksum;
}

function getMinMax(row: string): [min: number, max: number] {
    const numbers = row
        .split("	")
        .map((n) => Number(n))
        .sort((a, b) => a - b);

    return [numbers[0], numbers[numbers.length - 1]];
}
