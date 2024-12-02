import { } from '@lib/input';

type range = { min: number, max: number };
type ruleSet = range[];

const R_RULE = /([a-z\s]*): ([0-9]*-[0-9]*) or ([0-9]*-[0-9]*)/;
const RULE_COUNT = 20;

export default function (input: string[]) {
    const rules: Record<string, ruleSet> = {};

    for (let i = 0; i < RULE_COUNT; i++) {
        const match = R_RULE.exec(input[i]);

        rules[match[1]] = [
            getRange(match[2]),
            getRange(match[3]),
        ];
    } 

    let sum = 0;
    const ruleNames = Object.keys(rules);

    for (let i = RULE_COUNT + 5; i < input.length; i++) {
        const ticket = input[i].split(',').map(n => Number(n));

        for (const field of ticket) {
            let anyValid = false;

            for (const rule of ruleNames) {
                if (
                    field >= rules[rule][0].min && field <= rules[rule][0].max ||
                    field >= rules[rule][1].min && field <= rules[rule][1].max
                ) {
                    anyValid = true;
                    break;
                }
            }

            if (!anyValid) {
                sum += field;
            }
        }
    }

    return sum;
};

function getRange(range: string): range {
    const s = range.split('-');

    return {
        min: Number(s[0]),
        max: Number(s[1]),
    };
}
