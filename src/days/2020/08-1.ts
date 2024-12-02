import { } from '@lib/input';

export default function (input: string[]) {
    const ops = input.map((line) => { 
        const parts = line.split(' ');
        return {
            op: parts[0],
            param: Number(parts[1]),
        };

        
    });

    let acc = 0;
    let instr = 0;

    const visited = new Set<number>();

    while (true) {
        if (visited.has(instr)) {
            return acc;
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
};