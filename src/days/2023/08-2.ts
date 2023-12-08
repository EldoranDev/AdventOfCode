import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';
import { LCM } from '@lib/math/functions';

const START = 'A';
const END = 'Z';

export default function (input: string[], { logger }: Context) {
    const connections = new Map<string, string[]>();

    const [[directions], map] = getLineGroups(input);

    const current: string[] = [];

    for (const line of map) {
        const [, from, left, right] = /([A-Z\d]{3}) = \(([A-Z\d]{3}), ([A-Z\d]{3})\)/.exec(line)!;

        connections.set(from, [left, right]);

        if (from.endsWith(START)) {
            current.push(from);
        }
    }

    const cycles = current.map((start) => getCycleLength(start, directions, connections));

    return cycles.reduce((acc, cycle) => LCM(acc, cycle));
}

function getCycleLength(
    start: string,
    directions: string,
    connections: Map<string, string[]>,
): number {
    let steps = 0;
    let done = false;

    let current = start;

    while (!done) {
        const [left, right] = connections.get(current)!;

        if (directions[steps % directions.length] === 'L') {
            current = left;
        } else {
            current = right;
        }

        steps++;

        done = current.endsWith(END);
    }

    return steps;
}
