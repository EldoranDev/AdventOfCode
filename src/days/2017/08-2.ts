import { } from '@lib/input';
import { Context } from '@app/types';

type Op = 'inc' | 'dec';
type Comperator = '>' | '<' | '>=' | '<=' | '==' | '!=';

type Condition = {
    register: string,
    comp: Comperator,
    value: number,
}
type Instr = {
    register: string,
    operation: Op,
    value: number,
    condition: Condition,
}

type HandlerMap<K extends string, V> = { [key in K]: V}

type OpsHandler = (a: number, b: number) => number;
type CompHandler = (a: number, b: number) => boolean;

const Ops: HandlerMap<Op, OpsHandler> = {
    'inc': (a, b): number => a + b,
    'dec': (a, b): number => a - b,
}

const Comps: HandlerMap<Comperator,CompHandler> = {
    "!=": (a, b) => a != b,
    "<": (a, b) => a < b,
    "<=": (a, b) => a <= b,
    "==": (a, b) => a == b,
    ">": (a, b) => a > b,
    ">=": (a, b) => a >= b,
}

export default function (input: string[], { logger }: Context) {
    const register = new Map<string, number>()

    const instructions: Instr[] = input.map((line): Instr =>  {
        let l = line.split('if').map(p => p.trim());
        
        let [ register, operation, value] = l[0].split(' ');
        let [ conRegister, conOperation, conValue ] = l[1].split(' ');
        
        return {
            register,
            operation: operation as Op,
            value: Number(value),
            condition: {
                register: conRegister,
                comp: conOperation as Comperator,
                value: Number(conValue),
            }
        }
    });

    let highest = 0;

    for (const instr of instructions) {
         if (!register.has(instr.register)) {
            register.set(instr.register, 0);
         }

         if (!register.has(instr.condition.register)) {
            register.set(instr.condition.register, 0);
         }

         if (!Comps[instr.condition.comp](register.get(instr.condition.register), instr.condition.value)) {
            continue;
         }

         register.set(
            instr.register,
            Ops[instr.operation](register.get(instr.register), instr.value)
         );

         if (register.get(instr.register) > highest) {
            highest = register.get(instr.register);
         }
    }


    return highest;
};