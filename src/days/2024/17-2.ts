import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

interface CPU {
    A: bigint;
    B: bigint;
    C: bigint;

    IP: number;
    output: number[];
}

const OPS: { [key: number]: (cpu: CPU, operand: bigint) => void } = {
    // adv
    0: (cpu: CPU, operand: bigint): void => {
        cpu.A = (cpu.A / BigInt(2) ** getOperand(cpu, operand)) | BigInt(0);

        cpu.IP += 2;
    },
    // bxl
    1: (cpu: CPU, operand: bigint): void => {
        cpu.B = cpu.B ^ operand;

        cpu.IP += 2;
    },
    // bst
    2: (cpu: CPU, operand: bigint): void => {
        cpu.B = getOperand(cpu, operand) % BigInt(8);

        cpu.IP += 2;
    },

    // jnz
    3: (cpu: CPU, operand: bigint): void => {
        if (cpu.A === BigInt(0)) {
            cpu.IP += 2;
            return;
        }

        cpu.IP = Number(operand);
    },

    //bxc
    4: (cpu: CPU, operand: bigint): void => {
        cpu.B = cpu.B ^ cpu.C;
        cpu.IP += 2;
    },

    // out
    5: (cpu: CPU, operand: bigint): void => {
        cpu.output.push(Number(getOperand(cpu, operand) % BigInt(8)));
        cpu.IP += 2;
    },

    // bdv
    6: (cpu: CPU, operand: bigint): void => {
        cpu.B = (cpu.A / BigInt(2) ** getOperand(cpu, operand)) | BigInt(0);

        cpu.IP += 2;
    },

    // cdv
    7: (cpu: CPU, operand: bigint): void => {
        cpu.C = (cpu.A / BigInt(2) ** getOperand(cpu, operand)) | BigInt(0);

        cpu.IP += 2;
    },
};

function getOperand(cpu: CPU, operand: bigint): bigint {
    if (operand >= 0 && operand <= 3) {
        return operand;
    }

    switch (operand) {
        case BigInt(4):
            return cpu.A;
        case BigInt(5):
            return cpu.B;
        case BigInt(6):
            return cpu.C;
        default:
            throw new Error("Invalid operand");
    }
}

export default function (input: string[], { logger }: Context) {
    const [, instr] = getLineGroups(input);

    const program: number[] = instr[0].split(" ")[1].split(",").map(Number);

    // Half computed half manually
    const num = [5, 6, 0, 0, 6, 4, 4, 6, 7, 4, 0, 2, 4, 8, 5, 2];

    for (let i = 1; i < 16; i++) {
        for (let n = 0b000; n <= 0b111; n++) {
            // num[i] = n;

            const input = arrayToNum(num);

            const cpu: CPU = {
                A: BigInt(input),
                B: BigInt(0),
                C: BigInt(0),
                IP: 0,

                output: [],
            };

            let halted = false;

            while (!halted) {
                const op = program[cpu.IP];
                const par = program[cpu.IP + 1];

                if (op === undefined || par === undefined) {
                    halted = true;
                    continue;
                }

                OPS[op](cpu, BigInt(par));
            }

            console.log(cpu.output.join(","));
            console.log(program.join(","));

            return arrayToNum(num);

            if (cpu.output[16 - 1 - i] === program[16 - 1 - i]) {
                break;
            }
        }
    }

    return arrayToNum(num);
}

function arrayToNum(num: number[]): bigint {
    let n = BigInt(0);

    for (let i = 0; i < num.length; i++) {
        n += BigInt(num[i]);
        n <<= BigInt(3);
    }

    n >>= BigInt(3);

    return n;
}
