import { } from '@lib/input';
import { Context } from '@app/types';
import { create, getColumn } from '@lib/array2d';

type OP = "RECT" | "RROT" | "CROT";

type Instr = {
    A: number,
    B: number,
    OP: OP,
};

const RECT = /rect (\d+)x(\d+)/;
const RROT = /rotate row y=(\d+) by (\d+)/;
const CROT = /rotate column x=(\d+) by (\d+)/;

const OPS: Map<OP, RegExp> = new Map([
    ["RECT", RECT],
    ["RROT", RROT],
    ["CROT", CROT],
]);

const SIZE = { x: 50, y: 6};

export default function (input: string[], { logger }: Context) {
    const display = create<boolean>(SIZE.x, SIZE.y);

    for (let line of input) {
        let op = getInstruction(line);
        
        logger.debug(JSON.stringify(op));
        
        switch (op.OP) {
            case "RECT":
                for (let y = 0; y < op.B; y++) {
                    for (let x = 0; x < op.A; x++) {
                        display[y][x] = true;
                    }
                }
                break;
            case "RROT":
                for (let i = 0; i < op.B; i++) {
                    let last = display[op.A].pop();
                    display[op.A].unshift(last);
                }
                break;
            case "CROT":
                let column = getColumn(display, op.A);
                logger.debug(column);
                for (let i = 0; i < op.B; i++) {
                    let last = column.pop();
                    column.unshift(last);
                }

                for (let y = 0; y < column.length; y++) {
                    display[y][op.A] = column[y];
                }
                break;
        }
    }

    const out = display.reduce((prev: string, current: boolean[]) => {
        let row = current.map((e) => e ? '#' : '.').join('');

        return `${prev}\n${row}`;
    }, "");

    logger.debug(out);

    return out.split('').reduce((prev: number, current: string) => {
        return current === '#' ? prev + 1 : prev;
    }, 0)
};

function getInstruction(input: string): Instr {
    for (let mapping of OPS.entries()) {
        const match = mapping[1].exec(input);

        if (match) {
            return {
                A: Number(match[1]),
                B: Number(match[2]),
                OP: mapping[0],
            };
        }
    }
    throw new Error("Invalid input");
}