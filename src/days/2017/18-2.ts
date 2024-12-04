/* eslint-disable no-param-reassign */
import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const queueA = [];
    const queueB = [];

    const a = new SoundCard(0, input, queueA, queueB);
    const b = new SoundCard(1, input, queueB, queueA);

    while (!a.blocked || !b.blocked) {
        a.tick();
        b.tick();

        // console.log(a.blocked, b.blocked, queueA, queueB);
    }

    return b.tx;
}

type Instr = (card: SoundCard) => void;

class SoundCard {
    private rom: Instr[] = [];

    public PC: number = 0;

    public registers = {};

    public blocked: boolean = false;

    public tx = 0;

    constructor(
        programId: number,
        asm: string[],
        private inQueue: number[],
        private outQueue: number[],
    ) {
        this.rom = asm.map((row) => this.parse(row));

        Array.from({ length: 26 }, (_, i) => String.fromCharCode("a".charCodeAt(0) + i)).forEach(
            (char) => {
                this.registers[char] = 0;
            },
        );

        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.registers["p"] = programId;
    }

    public tick(): void {
        this.rom[this.PC](this);

        if (!this.blocked) {
            this.PC++;
        }
    }

    private parse(asm: string): Instr {
        const [instr, iX, iY] = asm.split(" ");

        const X = new Parameter(iX, this);
        const Y = new Parameter(iY, this);

        switch (instr) {
            case "snd":
                return () => {
                    this.tx++;
                    this.outQueue.unshift(X.getValue());
                };
            case "set":
                return () => {
                    this.registers[iX] = Y.getValue();
                };
            case "add":
                return () => {
                    this.registers[iX] += Y.getValue();
                };
            case "mul":
                return () => {
                    this.registers[iX] *= Y.getValue();
                };
            case "mod":
                return () => {
                    this.registers[iX] %= Y.getValue();
                };
            case "rcv":
                return () => {
                    if (this.inQueue.length > 0) {
                        this.registers[iX] = this.inQueue.pop();
                        this.blocked = false;
                    } else {
                        this.blocked = true;
                    }
                };
            case "jgz":
                return () => {
                    if (X.getValue() > 0) {
                        this.PC += Y.getValue() - 1;
                    }
                };
            default:
                throw new Error("Unknown instruction");
        }
    }
}

class Parameter {
    private isReference: boolean = false;

    constructor(
        private value: string,
        private card: SoundCard,
    ) {
        this.isReference = Number.isNaN(Number(value));
    }

    public getValue(): number {
        if (this.isReference) {
            return this.card.registers[this.value];
        }

        return Number(this.value);
    }
}
