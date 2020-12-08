import { resourceLimits } from 'worker_threads';
import { } from '../lib/input';

type Op = { op: string, param: number };
type Result = { loop: boolean, acc: number };

export default function (input: string[]) {
    const base = input.map((line) => { 
        let parts = line.split(' ');
        return {
            op: parts[0],
            param: Number(parts[1]),
        };
    });


    for (let i = 0; i < base.length; i++) {
        let op: Op[] = [...base];

        if (base[i].op === 'nop' && base[i].param !== 0) {
            op[i] = {
                ...base[i],
                op: 'jmp',
            };
        } else if (base[i].op === 'jmp') {
            op[i] = {
                ...base[i],
                op: 'nop',
            };
        } else {
            continue;
        }

        let result = execute(op);

        if (!result.loop) {
            return result.acc;
        }
    }

    return "NON";

};

function execute(ops: Op[]): Result {
    let acc = 0;
    let instr = 0;

    const visited = new Set<number>();

    while (instr < ops.length) {
        if (visited.has(instr)) {
            return { loop: true, acc};
        }

        visited.add(instr);

        const op = ops[instr];
        switch (op.op) {
            case 'acc':
                acc += op.param
                instr++;
                break;
            case 'jmp':
                instr += op.param;
                break;
            case 'nop':
                instr++;
                break;
        }
    }

    return { loop: false, acc};
}