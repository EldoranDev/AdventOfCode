/* eslint-disable no-param-reassign */
import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';

interface Workflow {
    name: string;
    rules: Rule[];
}

type OP = '<' | '>';

type Rule = [prop: string, op: OP, val: number, target: string];

type Range = [number, number];

type Ranges = { x: Range, m: Range, a: Range, s: Range };

const FLOWS = new Map<string, Workflow>();

const MIN = 1;
const MAX = 4_000;

export default function (input: string[], { logger }: Context) {
    const [win] = getLineGroups(input);

    win.forEach((w) => {
        const flow = parseWorkflow(w);
        FLOWS.set(flow.name, flow);
    });

    return count({
        x: [MIN, MAX],
        m: [MIN, MAX],
        a: [MIN, MAX],
        s: [MIN, MAX],
    }, 'in');
}

function parseWorkflow(w: string): Workflow {
    const [name, rules] = /(.*){(.*)}/.exec(w).slice(1);

    return {
        name,
        rules: rules.split(',').map(createRule),
    };
}

function createRule(s: string): Rule {
    if (s.includes('>') || s.includes('<')) {
        const [prop, op, val, target] = /([xmas])([<>])(\d+):(.+)/.exec(s).slice(1);

        return [
            prop,
            op as OP,
            parseInt(val, 10),
            target,
        ];
    }

    return [
        null,
        null,
        null,
        s,
    ];
}

function count(ranges: Ranges, name: string): number {
    // This path ends up with R and therefore all the ranges passed here are invalid
    if (name === 'R') {
        return 0;
    }

    // This path ends up with A and therefore all the ranges passed here are valid
    if (name === 'A') {
        let product = 1;
        for (const [min, max] of Object.values(ranges)) {
            product *= max - min + 1;
        }

        return product;
    }

    let result = 0;

    for (const [key, op, value, target] of FLOWS.get(name).rules) {
        if (key === null || op === null || value === null) {
            result += count(ranges, target);
            continue;
        }

        const [min, max] = ranges[key];

        let True: Range;
        let False: Range;

        if (op === '<') {
            True = [min, value - 1];
            False = [value, max];
        } else {
            True = [value + 1, max];
            False = [min, value];
        }

        if (True[0] <= True[1]) {
            const r = { ...ranges };

            r[key] = True;

            result += count(r, target);
        }

        if (False[0] <= False[1]) {
            ranges = { ...ranges };
            ranges[key] = False;
        }
    }

    return result;
}
