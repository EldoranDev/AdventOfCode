import { getLineGroups } from "@lib/input";
import { Context } from "@app/types";

interface CPU {
    A: number;
    B: number;
    C: number;

    IP: number;
    output: number[];
}

const OPS: { [key: number]: (cpu: CPU, operand: number) => void } = {
    // adv
    0: (cpu: CPU, operand: number): void => {
        cpu.A = (cpu.A / Math.pow(2, getOperand(cpu, operand))) | 0;

        cpu.IP += 2;
    },
    // bxl
    1: (cpu: CPU, operand: number): void => {
        cpu.B = cpu.B ^ operand;

        cpu.IP += 2;
    },
    // bst
    2: (cpu: CPU, operand: number): void => {
        cpu.B = getOperand(cpu, operand) % 8;

        cpu.IP += 2;
    },

    // jnz
    3: (cpu: CPU, operand: number): void => {
        if (cpu.A === 0) {
            cpu.IP += 2;
            return;
        }

        cpu.IP = operand;
    },

    //bxc
    4: (cpu: CPU, operand: number): void => {
        cpu.B = cpu.B ^ cpu.C;
        cpu.IP += 2;
    },

    // out
    5: (cpu: CPU, operand: number): void => {
        cpu.output.push(getOperand(cpu, operand) % 8);
        cpu.IP += 2;
    },

    // bdv
    6: (cpu: CPU, operand: number): void => {
        cpu.B = (cpu.A / Math.pow(2, getOperand(cpu, operand))) | 0;

        cpu.IP += 2;
    },

    // cdv
    7: (cpu: CPU, operand: number): void => {
        cpu.C = (cpu.A / Math.pow(2, getOperand(cpu, operand))) | 0;

        cpu.IP += 2;
    },
};

function getOperand(cpu: CPU, operand: number): number {
    if (operand >= 0 && operand <= 3) {
        return operand;
    }

    switch (operand) {
        case 4:
            return cpu.A;
        case 5:
            return cpu.B;
        case 6:
            return cpu.C;
        default:
            throw new Error("Invalid operand");
    }
}

const EXTRACTOR = /Register [ABC]: (\d+)/;

export default function (input: string[], { logger }: Context) {
    const [registers, instr] = getLineGroups(input);

    const program: number[] = instr[0].split(" ")[1].split(",").map(Number);

    const [, A] = EXTRACTOR.exec(registers[0]);
    const [, B] = EXTRACTOR.exec(registers[1]);
    const [, C] = EXTRACTOR.exec(registers[2]);

    const cpu: CPU = {
        A: Number(A),
        B: Number(B),
        C: Number(C),
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

        OPS[op](cpu, par);
    }

    return cpu.output.join(",");
}
