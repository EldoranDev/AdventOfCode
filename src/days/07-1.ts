import { } from '../lib/input';

const mainExtractor = /(?<color>[a-z]* [a-z]*) bags contain (?<contains>( ?[0-9]* [a-z]* [a-z]* bags?[,\.])*)/;
const secondaryExtractor = /(?<count>[0-9]*) (?<color>[a-z]* [a-z]*)/;

export default function (input: string[]) {
    const matches = input.map((line) => mainExtractor.exec(line));
    
    const search = 'shiny gold';

    type ruleSet = Record<string, rule>;
    type rule = { color: string, contains: Record<string, number> };
    const rules: ruleSet = {};

    for (let match of matches) {
        let rule: rule = {
            color: match.groups.color,
            contains: { },
        };

        if (match.groups.contains) {
            match.groups.contains.split(',').forEach((m) => {
                const mm = secondaryExtractor.exec(m.trim());
                rule.contains[mm.groups.color] = Number(mm.groups.count);
            });
        }

        rules[rule.color] = rule;
    }

    const finalList: Set<string> = new Set<string>();
    const potential: string[] = Object.values(rules).filter((rule) => Object.keys(rule.contains).includes(search)).map((rule) => rule.color);

    while (potential.length > 0) {
        const current = potential.pop();
        finalList.add(current);

        Object.values(rules).filter((rule) => Object.keys(rule.contains).includes(current)).map((rule) => rule.color).forEach((color) => {
            if (!finalList.has(color)) {
                potential.push(color);
            }
        });
    }

    return finalList.size;
};