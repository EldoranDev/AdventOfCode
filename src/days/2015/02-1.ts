import {} from "@lib/input";

export default function (input: string[]) {
    let sum = 0;

    for (let i = 0; i < input.length; i++) {
        const [l, w, h] = input[i].split("x").map((d) => Number(d));

        const sides = [l * w, w * h, h * l].sort((a, b) => a - b);

        sum += sides.reduce((ls, s) => ls + s * 2, 0);
        sum += sides[0];
    }

    return sum;
}
