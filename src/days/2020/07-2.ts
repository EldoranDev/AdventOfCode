import {} from "@lib/input";

const mainExtractor =
    /(?<color>[a-z]* [a-z]*) bags contain (?<contains>( ?[0-9]* [a-z]* [a-z]* bags?[,\.])*)/;
const secondaryExtractor = /(?<count>[0-9]*) (?<color>[a-z]* [a-z]*)/;

type ruleSet = Record<string, rule>;
type rule = { color: string; contains: Record<string, number> };

export default function (input: string[]) {
    const matches = input.map((line) => mainExtractor.exec(line));

    const search = "shiny gold";
    const rules: ruleSet = {};

    for (const match of matches) {
        const rule: rule = {
            color: match.groups.color,
            contains: {},
        };

        if (match.groups.contains) {
            match.groups.contains.split(",").forEach((m) => {
                const mm = secondaryExtractor.exec(m.trim());
                rule.contains[mm.groups.color] = Number(mm.groups.count);
            });
        }

        rules[rule.color] = rule;
    }

    return getCount(rules[search], rules) - 1;
}

function getCount(rule: rule, rules: ruleSet): number {
    return (
        1 +
        Object.keys(rule.contains).reduce(
            (count, color) => count + rule.contains[color] * getCount(rules[color], rules),
            0,
        )
    );
}
