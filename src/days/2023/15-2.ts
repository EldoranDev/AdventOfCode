/* eslint-disable max-len */
import { } from '@lib/input';
import { Context } from '@app/types';

interface Lense {
    label: string;
    focalLength: number;
}

interface Instruction {
    type: 'remove' | 'add';
    box: number;
    label: string;
    focalLength?: number;
}

export default function (input: string[], { logger }: Context) {
    const boxes = Array.from({ length: 256 }, () => [] as Lense[]);

    for (const instruction of input[0].split(',').map(parse)) {
        const box = boxes[instruction.box];

        const index = box.findIndex((lense) => lense.label === instruction.label);

        if (instruction.type === 'remove' && index !== -1) {
            box.splice(index, 1);
        } else if (instruction.type === 'add' && index === -1) {
            box.push({ label: instruction.label, focalLength: instruction.focalLength });
        } else if (instruction.type === 'add') {
            box[index].focalLength = instruction.focalLength;
        }
    }

    let power = 0;

    for (let i = 0; i < boxes.length; i++) {
        power += (i + 1) * boxes[i].reduce((acc, lense, idx) => acc + lense.focalLength * (idx + 1), 0);
    }

    return power;
}

function parse(instr: string): Instruction {
    if (instr.includes('=')) {
        const [,label, focalLength] = /([a-z]+)=(\d+)/.exec(instr);

        return {
            box: hash(label),
            label,
            focalLength: parseInt(focalLength, 10),
            type: 'add',
        };
    }

    const [,label] = /([a-z]+)/.exec(instr);

    return {
        box: hash(label),
        label,
        type: 'remove',
    };
}

function hash(input: string): number {
    let val = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        val += char;
        val *= 17;
        val %= 256;
    }

    return val;
}
