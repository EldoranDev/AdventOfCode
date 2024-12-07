import {} from "@lib/input";
import { Context } from "@app/types";

const OP = [(a, b) => a + b, (a, b) => a * b, (a, b) => Number(`${a}${b}`)];

export default function (input: string[], { logger }: Context) {
    const equations: [number, number[]][] = input.map((line) => {
        const [target, numbs] = line.split(":");

        return [Number(target), numbs.trim().split(" ").map(Number)];
    });

    let sum = 0;

    for (const [target, numbers] of equations) {
        if (solve(numbers[0], numbers, 1, target)) {
            sum += target;
        }
    }

    return sum;
}

function solve(current: number, array: number[], index: number, target: number): boolean {
    if (array.length === index) {
        return target === current;
    }

    // Can do bigger-equals as from here on we'll only add
    if (current >= target) {
        return false;
    }

    for (const op of OP) {
        if (solve(op(current, array[index]), array, index + 1, target)) {
            return true;
        }
    }

    return false;
}
