import { getLineGroups } from "@lib/input";

type Grammar = Record<string, string[][]>;
type Lookup = Record<string, string[]>;

export default function (input: string[]) {
    const groups = getLineGroups(input);

    const grammar = parseGrammar(groups[0].map((s) => s.replace(":", " ->").replace(/"/g, "")));

    let valid = 0;

    for (let i = 0; i < groups[1].length; i++) {
        if (cyk(groups[1][i].split(""), grammar, "0")) {
            valid++;
        }
    }

    return valid;
}

function cyk(word: string[], grammar: Grammar, start: string): boolean {
    const R: string[][][] = new Array(word.length);

    const lookup: Lookup = grammarToLookup(grammar);

    for (let i = 0; i < word.length; i++) {
        R[i] = new Array(word.length);
        for (let j = 0; j < word.length; j++) {
            R[i][j] = [];
        }
    }

    // Set initial row
    for (let s = 0; s < word.length; s++) {
        const key = getKey(word[s]);
        const rule = lookup[key];

        if (rule === undefined) {
            console.log(key);
            throw new Error("Input word is using invalid terminal");
        }

        R[0][s] = [...rule];
    }

    // Loop over the NxN Matrix bottom to top (inversed here for array math)
    for (let line = 1; line < word.length; line++) {
        // Try to find a valid rule for the current cell
        for (let c = 0; c < word.length - 1; c++) {
            // Check all valid combinations
            for (let s = 0; s < line; s++) {
                const left = R[line - 1 - s][c];
                const right = R[s][c + line - s];

                if (left === undefined || right === undefined) continue;

                for (const l of left) {
                    for (const r of right) {
                        const key = getKey([l, r]);
                        if (lookup[key] !== undefined) {
                            R[line][c].push(...lookup[key]);
                        }
                    }
                }
            }
        }
    }

    // print(R);

    return R[word.length - 1][0].includes(start);
}

function print(R: string[][][]): void {
    for (let y = R.length - 1; y >= 0; y--) {
        for (let x = 0; x < R[y].length - y; x++) {
            process.stdout.write(`{${R[y][x].join(",")}} `);
        }

        process.stdout.write("\n");
    }
}

function parseGrammar(input: string[]): Grammar {
    const grammar: Grammar = {};

    for (const line of input) {
        const parts = line.replace(/"/g, "").split(" -> ");

        grammar[parts[0]] = parts[1].split(" | ").map((p) => p.split(" "));
    }

    let newRuleCount = 0;

    // Remove triplets
    for (const i of Object.keys(grammar)) {
        for (let j = 0; j < grammar[i].length; j++) {
            const newRule = [...grammar[i]];

            if (grammar[i][j].length === 3) {
                const rule = newRule[i].splice(j, 1)[0];

                const a = input.length + ++newRuleCount;
                const b = input.length + ++newRuleCount;

                grammar[a] = [[rule[0], rule[1]]];
                grammar[b] = [[rule[1], rule[2]]];

                grammar[i].push([rule[0], b.toString()]);
                grammar[i].push([a.toString(), rule[1]]);
            }

            grammar[i] = newRule;
        }
    }

    console.log("New Rules added: ", newRuleCount);
    return grammar;
}

function grammarToLookup(grammar: Grammar): Lookup {
    const lookup: Record<string, string[]> = {};

    for (const root of Object.keys(grammar)) {
        for (const production of grammar[root]) {
            const key = getKey(production);

            if (lookup[key] === undefined) {
                lookup[key] = [];
            }

            lookup[key].push(root);
        }
    }

    return lookup;
}

function getKey(production: string | string[]) {
    if (typeof production === "string") {
        production = [production];
    } else {
        if (production.length > 2) {
            throw new Error(
                "Not a valid Key in CYK. Grammar seems not to be in Chomsky normal form.",
            );
        }
    }

    return JSON.stringify(production, null, 0);
}
