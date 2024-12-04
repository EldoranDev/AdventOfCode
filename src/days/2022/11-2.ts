/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import {} from "@lib/input";
import { Context } from "@app/types";

type Operation = (number) => number;
type Test = (number) => number;

interface Monkey {
    items: Array<number>;
    operation: Operation;
    test: Test;
    count: number;
    mod: number;
}

const ROUNDS = 10000;

export default function (input: string[], { logger }: Context) {
    const monkeys: Array<Monkey> = [
        {
            items: [56, 52, 58, 96, 70, 75, 72],
            count: 0,
            operation: (old) => old * 17,
            test: (wl) => (wl % 11 === 0 ? 2 : 3),
            mod: 11,
        },
        {
            items: [75, 58, 86, 80, 55, 81],
            count: 0,
            operation: (old) => old + 7,
            test: (wl) => (wl % 3 === 0 ? 6 : 5),
            mod: 3,
        },
        {
            items: [73, 68, 73, 90],
            count: 0,
            operation: (old) => old * old,
            test: (wl) => (wl % 5 === 0 ? 1 : 7),
            mod: 5,
        },
        {
            items: [72, 89, 55, 51, 59],
            count: 0,
            operation: (old) => old + 1,
            test: (wl) => (wl % 7 === 0 ? 2 : 7),
            mod: 7,
        },
        {
            items: [76, 76, 91],
            count: 0,
            operation: (old) => old * 3,
            test: (wl) => (wl % 19 === 0 ? 0 : 3),
            mod: 19,
        },
        {
            items: [88],
            count: 0,
            operation: (old) => old + 4,
            test: (wl) => (wl % 2 === 0 ? 6 : 4),
            mod: 2,
        },
        {
            items: [64, 63, 56, 50, 77, 55, 55, 86],
            count: 0,
            operation: (old) => old + 8,
            test: (wl) => (wl % 13 === 0 ? 4 : 0),
            mod: 13,
        },
        {
            items: [79, 58],
            count: 0,
            operation: (old) => old + 6,
            test: (wl) => (wl % 17 === 0 ? 1 : 5),
            mod: 17,
        },
    ];

    const M = monkeys.reduce((prev, current) => prev * current.mod, 1);

    for (let i = 0; i < ROUNDS; i++) {
        monkeys.forEach((monkey) => {
            monkey.count += monkey.items.length;
            monkey.items = monkey.items.map((item) => monkey.operation(item));

            monkey.items = monkey.items.map((item) => item % M);

            while (monkey.items.length > 0) {
                const item = monkey.items.shift();
                monkeys[monkey.test(item)].items.push(item);
            }
        });
    }

    const list = monkeys.map((m) => m.count).sort((a, b) => b - a);

    return list[0] * list[1];
}
