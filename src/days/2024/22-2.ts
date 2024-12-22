import {} from "@lib/input";
import { Context } from "@app/types";

class Prng {
    private num: bigint;

    constructor(seed: bigint) {
        this.num = seed;
    }

    getNext(): bigint {
        this.num = (this.num ^ (this.num * BigInt(64))) % BigInt(16777216);
        this.num = (this.num ^ ((this.num / BigInt(32)) | BigInt(0))) % BigInt(16777216);
        this.num = (this.num ^ (this.num * BigInt(2048))) % BigInt(16777216);

        return this.num;
    }
}

interface Seller {
    prices: number[];
    changes: number[];
}

export default function (input: string[], { logger }: Context) {
    const sequenceMap = new Map<string, number>();
    const sellers = input.map((line) => generateValues(BigInt(line)));

    for (const seller of sellers) {
        generateSequence(seller, sequenceMap);
    }

    return [...sequenceMap.values()].sort((a, b) => a - b).pop();
}

function generateValues(initial: bigint): Seller {
    const seller: Seller = {
        prices: [],
        changes: [],
    };

    seller.prices.push(Number(initial) % 10);
    const prng = new Prng(initial);

    for (let i = 0; i < 2000; i++) {
        seller.prices.push(Number(prng.getNext()) % 10);
    }

    for (let i = 1; i < seller.prices.length; i++) {
        seller.changes.push(seller.prices[i] - seller.prices[i - 1]);
    }

    return seller;
}

function generateSequence(seller: Seller, map: Map<string, number>) {
    const window = [-1, ...seller.changes.slice(0, 3)];
    const closed = new Set<string>();

    for (let i = 3; i < seller.changes.length; i++) {
        window.shift();
        window.push(seller.changes[i]);

        const s = window.join("|");

        // This sequence would've been used earlier so do not update it
        if (closed.has(s)) {
            continue;
        }

        closed.add(s);

        if (!map.has(s)) {
            map.set(s, 0);
        }

        map.set(s, map.get(s) + seller.prices[i + 1]);
    }
}
