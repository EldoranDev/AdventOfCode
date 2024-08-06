/* eslint-disable no-param-reassign */
import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const card = new SoundCard(input);

    let frequency = null;

    while (frequency === null) {
        frequency = card.tick();
    }

    return frequency;
}

type Response = number | null;
type Instr = (card: SoundCard) => Response;

class SoundCard {
    private rom: Instr[] = [];

    public PC: number = 0;

    public registers = {};

    public sound: number | null = null;

    private lastSound: number | null = null;

    constructor(asm: string[]) {
        this.rom = asm.map((row) => this.parse(row));

        Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i)).forEach((char) => {
            this.registers[char] = 0;
        });
    }

    public tick(): number | null {
        const rcv = this.rom[this.PC](this);

        this.PC++;

        return rcv;
    }

    private parse(asm: string): Instr {
        const [instr, iX, iY] = asm.split(' ');

        const X = new Parameter(iX, this);
        const Y = new Parameter(iY, this);

        switch (instr) {
            case 'snd':
                return (): Response => {
                    this.sound = X.getValue();
                    this.lastSound = X.getValue();
                    return null;
                };
            case 'set':
                return (): Response => {
                    this.registers[iX] = Y.getValue();
                    return null;
                };
            case 'add':
                return (): Response => {
                    this.registers[iX] += Y.getValue();
                    return null;
                };
            case 'mul':
                return (): Response => {
                    this.registers[iX] *= Y.getValue();
                    return null;
                };
            case 'mod':
                return (): Response => {
                    this.registers[iX] %= Y.getValue();
                    return null;
                };
            case 'rcv':
                return (): Response => {
                    if (X.getValue() !== 0) {
                        return this.lastSound;
                    }

                    return null;
                };
            case 'jgz':
                return (): Response => {
                    if (X.getValue() > 0) {
                        this.PC += Y.getValue() - 1;
                    }
                    return null;
                };
            default:
                throw new Error('Unknown instruction');
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

        return (Number(this.value));
    }
}
