import {} from "@lib/input";

export default function (input: string[]) {
    const [line] = input;
    let sum = 0;

    for (let i = 0; i <= line.length; i++) {
        if (line[i] === line[(i + line.length / 2) % line.length]) {
            sum += Number(line[i]);
        }
    }

    return sum;
}
