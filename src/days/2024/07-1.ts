import {} from "@lib/input";
import { Context } from "@app/types";

const OP = [(a, b) => a + b, (a, b) => a * b];

export default function (input: string[], { logger }: Context) {
    const equations: [number, number[]][] = input.map((line) => {
        const [target, numbs] = line.split(":");

        return [Number(target), numbs.trim().split(" ").map(Number)];
    });

    let sum = 0;

    for (const [target, numbers] of equations) {
        const start = numbers.shift();

        if (solve(start, numbers, target)) {
            sum += target;
        }
    }

    return sum;
}

function solve(current: number, array: number[], target: number): boolean {
    if (array.length === 0) {
        return target === current;
    }

    const next = array.shift();

    for (const op of OP) {
        if (solve(op(current, next), [...array], target)) {
            return true;
        }
    }

    return false;
}
