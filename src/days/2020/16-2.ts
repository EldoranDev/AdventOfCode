import {} from "@lib/input";

type range = { min: number; max: number };
type ruleSet = range[];

const R_RULE = /([a-z\s]*): ([0-9]*-[0-9]*) or ([0-9]*-[0-9]*)/;
const RULE_COUNT = 20;

export default function (input: string[]) {
    const rules: Record<string, ruleSet> = {};
    const position: Record<string, number> = {};

    const ticket = input[RULE_COUNT + 2].split(",").map((n) => Number(n));

    for (let i = 0; i < RULE_COUNT; i++) {
        const match = R_RULE.exec(input[i]);

        rules[match[1]] = [getRange(match[2]), getRange(match[3])];
    }

    let tickets: number[][] = [];

    for (let i = RULE_COUNT + 5; i < input.length; i++) {
        tickets[i - (RULE_COUNT + 5)] = input[i].split(",").map((n) => Number(n));
    }

    tickets = tickets.filter((t) => isValid(t, rules));
    const ruleNames = Object.keys(rules).reverse();
    const possible: Record<string, number[]> = ruleNames.reduce((p, c) => {
        p[c] = [];
        return p;
    }, {});

    for (let c = 0; c < ticket.length; c++) {
        const filtered = ruleNames.filter((rule) => {
            for (let l = 0; l < tickets.length; l++) {
                if (
                    !(tickets[l][c] >= rules[rule][0].min && tickets[l][c] <= rules[rule][0].max) &&
                    !(tickets[l][c] >= rules[rule][1].min && tickets[l][c] <= rules[rule][1].max)
                ) {
                    return false;
                }
            }

            return true;
        });

        for (const rule of filtered) {
            possible[rule].push(c);
        }
    }

    while (Object.keys(possible).length !== 0) {
        const next = Object.keys(possible).find((p) => possible[p].length === 1);

        const column = possible[next][0];

        delete possible[next];

        position[next] = column;

        for (const k of Object.keys(possible)) {
            possible[k] = possible[k].filter((n) => n !== column);
        }
    }

    const pos = Object.keys(position).filter((s) => s.includes("departure"));

    return pos.reduce((res, rule) => res * ticket[position[rule]], 1);
}

function getRange(range: string): range {
    const s = range.split("-");

    return {
        min: Number(s[0]),
        max: Number(s[1]),
    };
}

function isValid(ticket: number[], rules: Record<string, ruleSet>): boolean {
    const ruleNames = Object.keys(rules);

    for (const field of ticket) {
        let anyValid = false;

        for (const rule of ruleNames) {
            if (
                (field >= rules[rule][0].min && field <= rules[rule][0].max) ||
                (field >= rules[rule][1].min && field <= rules[rule][1].max)
            ) {
                anyValid = true;
                break;
            }
        }

        if (!anyValid) {
            return false;
        }
    }

    return true;
}
