import { } from '../lib/input';

export default function (input: string[]) {
    let deps = input[1].split(',').map((d) => Number(d));

    for (let i = 0; i < deps.length; i++) {
        if (Number.isNaN(deps[i])) continue;

        console.log(`(x + ${i}) mod ${deps[i]} = 0;`)
    }

    // https://www.wolframalpha.com/input/?i=solve+%28x+%2B+0%29+mod+19+%3D+0%3B+%28x+%2B+13%29+mod+37+%3D+0%3B+%28x+%2B+19%29+mod+523+%3D+0%3B+%28x+%2B+37%29+mod+13+%3D+0%3B+%28x+%2B+42%29+mod+23+%3D+0%3B+%28x+%2B+48%29+mod+29+%3D+0%3B+%28x+%2B+50%29+mod+547+%3D+0%3B+%28x+%2B+60%29+mod+41+%3D+0%3B+%28x+%2B+67%29+mod+17+%3D+0%3B

    return 0;
};
