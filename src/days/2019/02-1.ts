import { mapToNumber } from "@lib/input";

export default function (input: string[]) {
    const program = mapToNumber(input[0].split(","));

    let instr = 0;
    const memory = [...program];

    memory[1] = 12;
    memory[2] = 2;

    let halted = false;

    while (!halted) {
        const OP = memory[instr];

        switch (OP) {
            case 1:
                memory[memory[instr + 3]] = memory[memory[instr + 1]] + memory[memory[instr + 2]];
                break;
            case 2:
                memory[memory[instr + 3]] = memory[memory[instr + 1]] * memory[memory[instr + 2]];
                break;
            case 99:
                halted = true;
                break;
        }

        instr += 4;
    }

    return memory[0];
}
