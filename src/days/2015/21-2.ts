import {} from "@lib/input";
import { Context } from "@app/types";

type Item = { Name: string; Cost: number; Damage: number; Armor: number };
type Unit = { HP: number; Attack: number; Defense: number };

const WEAPONS: Array<Item> = [
    { Name: "Dagger", Cost: 8, Damage: 4, Armor: 0 },
    { Name: "Shortsword", Cost: 10, Damage: 5, Armor: 0 },
    { Name: "Warhammer", Cost: 25, Damage: 6, Armor: 0 },
    { Name: "Longsword", Cost: 40, Damage: 7, Armor: 0 },
    { Name: "Greataxe", Cost: 74, Damage: 8, Armor: 0 },
];

const ARMORS: Array<Item> = [
    { Name: "Leather", Cost: 13, Damage: 0, Armor: 1 },
    { Name: "Chainmail", Cost: 31, Damage: 0, Armor: 2 },
    { Name: "Splintmail", Cost: 53, Damage: 0, Armor: 3 },
    { Name: "Bendedmail", Cost: 75, Damage: 0, Armor: 4 },
    { Name: "Platemail", Cost: 102, Damage: 0, Armor: 5 },
];

const RINGS: Array<Item> = [
    { Name: "Damage +1", Cost: 25, Damage: 1, Armor: 0 },
    { Name: "Damage +2", Cost: 50, Damage: 2, Armor: 0 },
    { Name: "Damage +3", Cost: 100, Damage: 3, Armor: 0 },
    { Name: "Defense +1", Cost: 20, Damage: 0, Armor: 1 },
    { Name: "Defense +2", Cost: 40, Damage: 0, Armor: 2 },
    { Name: "Defense +3", Cost: 80, Damage: 0, Armor: 3 },
];

export default function (input: string[], { logger }: Context) {
    let currentMax = 0;

    const boss = getBoss(input);
    const rings = calculateRings();

    for (let w = 0; w < WEAPONS.length; w++) {
        for (let a = -1; a < ARMORS.length; a++) {
            for (let r = 0; r < rings.length; r++) {
                const cost = getCosts(w, a, rings[r]);

                // Skip Combination if its more than our cheapest win
                if (cost <= currentMax) {
                    continue;
                }

                const won = sim(buildHero(w, a, rings[r]), { ...boss });
                logger.debug(`Gold Spend: ${cost} -> Won: ${won}`);

                if (won) {
                    continue;
                }

                currentMax = cost;
            }
        }
    }

    return currentMax;
}

function getBoss(lines: string[]): Unit {
    return {
        HP: Number(lines[0].split(": ")[1]),
        Attack: Number(lines[1].split(": ")[1]),
        Defense: Number(lines[2].split(": ")[1]),
    };
}

function buildHero(w: number, a: number, rings: number[]): Unit {
    const h: Unit = {
        HP: 100,
        Attack: 0,
        Defense: 0,
    };

    [WEAPONS[w], ...rings.map((r) => RINGS[r])].forEach((item) => {
        h.Attack += item.Damage;
        h.Defense += item.Armor;
    });

    if (a >= 0) {
        h.Defense += ARMORS[a].Armor;
    }

    return h;
}

function getCosts(w: number, a: number, rings: number[]): number {
    let sum = 0;

    sum += WEAPONS[w].Cost;

    if (a >= 0) {
        sum += ARMORS[a].Cost;
    }

    rings.forEach((r) => {
        sum += RINGS[r].Cost;
    });

    return sum;
}

function calculateRings(): Array<number[]> {
    const combs = [
        [], // no rings
    ];

    // Every ring alone
    for (let i = 0; i < RINGS.length; i++) {
        combs.push([i]);
    }

    // All combinations of two rings
    for (let i = 0; i < RINGS.length; i++) {
        for (let j = i + 1; j < RINGS.length; j++) {
            combs.push([i, j]);
        }
    }

    return combs;
}

function sim(hero: Unit, boss: Unit): boolean {
    while (true) {
        let diff = Math.max(1, hero.Attack - boss.Defense);
        boss.HP -= diff;

        if (boss.HP <= 0) {
            return true;
        }

        diff = Math.max(1, boss.Attack - hero.Defense);
        hero.HP -= diff;

        if (hero.HP <= 0) {
            return false;
        }
    }
}
