import { getLineGroups } from '@lib/input';

export default function (input: string[]) {
    const groups = getLineGroups(input);

    const rules: string[] = [];
    const pending = [];

    for (const line of groups[0]) {
        const parts = line.split(':');

        if (parts[1].includes('"')) {
            rules[Number(parts[0])] = parts[1].substring(2, parts[1].length-1);
        } else {
            pending[Number(parts[0])] = parts[1].trim().split('|').map(p => p.trim().split(' ').map(n => Number(n)));
        }
    }

    const valid: string[] = pending[0].map((r) => unwrap(r, pending, rules))[0];

    return groups[1].filter(l => valid.includes(l)).length;
};

function unwrap(rule: number[], rules, charMap: string[]): any {
    let unwrapped = [ '' ];

    for (let i = 0; i < rule.length; i++) {
        if (Array.isArray(rules[rule[i]])) {
            const validSubs: string[] = rules[rule[i]].map((r) => unwrap(r, rules, charMap));

            const newUnwrapped = [];

            for (let j = 0; j < validSubs.length; j++) {                
                for (let k = 0; k < validSubs[j].length; k++) {
                    newUnwrapped.push(...unwrapped.map(u => u+validSubs[j][k]));
                }
            }
            unwrapped = newUnwrapped;
        } else {
            for(let j = 0; j < unwrapped.length; j++) {
                unwrapped[j] += charMap[rule[i]];
            }
        }
    }

    return unwrapped;
}