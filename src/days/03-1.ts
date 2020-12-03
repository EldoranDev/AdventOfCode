export default function (input: string[]) {
    let count = 0;

    let x = 3;

    for (let y = 1; y < input.length; y++) {
        if (input[y].charAt(x % input[y].length) === '#') {
            count++;
        }

        x += 3;
    }

    return count;
};