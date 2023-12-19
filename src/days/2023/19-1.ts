import { getLineGroups } from '@lib/input';
import { Context } from '@app/types';

interface Part {
    x: number;
    m: number;
    a: number;
    s: number;
}

interface Workflow {
    name: string;
    rules: Rule[];
}

type Rule = (Part: Part) => string | null;

export default function (input: string[], { logger }: Context) {
    const workflows = new Map<string, Workflow>();
    const [win, pin] = getLineGroups(input);

    const parts = pin.map(parsePart);

    win.forEach((w) => {
        const flow = parseWorkflow(w);
        workflows.set(flow.name, flow);
    });

    const A = [];

    parts.forEach((p) => {
        let flow = 'in';

        while (flow !== 'A' && flow !== 'R') {
            const workflow = workflows.get(flow);

            flow = applyRules(p, workflow.rules);
        }

        if (flow === 'A') {
            A.push(p);
        }
    });

    return A.reduce((acc, p) => acc + p.x + p.m + p.a + p.s, 0);
}

function parsePart(p: string): Part {
    const [x, m, a, s] = /{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/.exec(p).slice(1).map((n) => parseInt(n, 10));

    return {
        x, m, a, s,
    };
}

function parseWorkflow(w: string): Workflow {
    const [name, rules] = /(.*){(.*)}/.exec(w).slice(1);

    return {
        name,
        rules: rules.split(',').map(createRule),
    };
}

function createRule(s: string): Rule {
    if (s.includes('>')) {
        const [prop, val, target] = /([xmas])>(\d+):(.+)/.exec(s).slice(1);

        return (part: Part): string | null => {
            if (part[prop] > parseInt(val, 10)) {
                return target;
            }

            return null;
        };
    }

    if (s.includes('<')) {
        const [prop, val, target] = /([xmas])<(\d+):(.+)/.exec(s).slice(1);

        return (part: Part): string | null => {
            if (part[prop] < parseInt(val, 10)) {
                return target;
            }

            return null;
        };
    }

    return (part: Part): string | null => s;
}

function applyRules(part: Part, rules: Rule[]): string {
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const result = rule(part);

        if (result !== null) {
            return result;
        }
    }

    throw new Error('Invalid set of rules');
}
