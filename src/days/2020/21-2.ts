import {} from "@lib/input";

export default function (input: string[]) {
    const allergenMap: Record<string, string[][]> = {};
    const foods: string[][] = [];

    const potential: Record<string, string[]> = {};

    const map: Record<string, string> = {};

    for (const line of input) {
        const parts = line.substr(0, line.length - 1).split("(contains ");
        const ingr = parts[0].trim().split(" ");
        const algs = parts[1].split(", ");

        foods.push(ingr);

        for (const alg of algs) {
            if (allergenMap[alg] === undefined) {
                allergenMap[alg] = [];
            }

            allergenMap[alg].push(ingr);
        }
    }

    let allergens = Object.keys(allergenMap);

    for (const allergen of allergens) {
        let filtered = allergenMap[allergen][0];

        for (let i = 1; i < allergenMap[allergen].length; i++) {
            filtered = filtered.filter((a) => allergenMap[allergen][i].includes(a));
        }

        potential[allergen] = filtered;
    }

    do {
        allergens = Object.keys(potential);
        const del = [];

        for (const allergen of allergens) {
            if (potential[allergen].length === 1) {
                const food = potential[allergen][0];

                map[food] = allergen;

                for (const it of allergens) {
                    potential[it] = potential[it].filter((a) => a !== food);
                }

                del.push(allergen);
            }
        }

        for (const d of del) {
            delete potential[d];
        }
    } while (allergens.length > 0);

    const flip: Record<string, string> = {};

    for (const food of Object.keys(map)) {
        flip[map[food]] = food;
    }

    return Object.keys(flip)
        .sort()
        .map((f) => flip[f])
        .join(",");
}
