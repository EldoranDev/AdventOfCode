import {} from "@lib/input";

export default function (input: string[]) {
    const banks = input[0].split("	").map((n) => Number(n));

    let loop = false;

    const set: string[] = [];
    let key = null;
    do {
        const highest = Math.max(...banks);
        const index = banks.indexOf(highest);

        banks[index] = 0;

        for (let i = 0; i < highest; i++) {
            banks[(index + i + 1) % banks.length]++;
        }

        key = banks.join("-");

        loop = set.includes(key);

        set.push(key);
    } while (!loop);

    return set.length - 1 - set.indexOf(key);
}
