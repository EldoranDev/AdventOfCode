import { } from '@lib/input';

export default function (input: string[]) {

    let [ line ] = input;
    let sum = 0;

    for (let i = 0; i <= line.length; i++) {
        if (line[i] === line[(i+1) % line.length]) {
            sum += Number(line[i]);
        }
    }

    return sum;
};
