import { } from '@lib/input';
import { Context } from '@app/types';

type InstructionType = 'hlf' | 'tpl' | 'inc' | 'jmp' | 'jie' | 'jio';

type Instruction = {
    type: InstructionType;
    register?: number;
    offset?: number;
};

const REGISTER_A = 0;
const REGISTER_B = 1;

export default function (input: string[], { logger }: Context) {
    const instructions: Instruction[] = input.map((line) => {
        const [type, ...args] = line.split(' ');

        const instr: Instruction = {
            type: type as InstructionType,
        };

        const register = args[0].replace(',', '');

        if (type === 'jmp') {
            instr.offset = parseInt(register, 10);
        } else {
            instr.register = register === 'a' ? REGISTER_A : REGISTER_B;

            if (args.length > 1) {
                instr.offset = parseInt(args[1], 10);
            }
        }

        return instr;
    });

    const register = new Uint32Array(2);
    let ip = 0;

    while (ip >= 0 && ip < instructions.length) {
        const instr = instructions[ip];

        switch (instr.type) {
            case 'hlf':
                register[instr.register] /= 2;
                ip++;
                break;
            case 'tpl':
                register[instr.register] *= 3;
                ip++;
                break;
            case 'inc':
                register[instr.register]++;
                ip++;
                break;
            case 'jmp':
                ip += instr.offset;
                break;
            case 'jie':
                if (register[instr.register] % 2 === 0) {
                    ip += instr.offset;
                } else {
                    ip++;
                }
                break;
            case 'jio':
                if (register[instr.register] === 1) {
                    ip += instr.offset;
                } else {
                    ip++;
                }
                break;
            default:
                throw new Error(`Unknown instruction: ${instr.type}`);
        }
    }

    return register[REGISTER_B];
}
