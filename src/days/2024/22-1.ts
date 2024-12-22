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

export default function (input: string[], { logger }: Context) {
    const prng = input.map((line) => new Prng(BigInt(Number(line))));

    for (let i = 0; i < 1999; i++) {
        for (const p of prng) {
            p.getNext();
        }
    }

    return prng.reduce((prev, current) => prev + Number(current.getNext()), 0);
}
