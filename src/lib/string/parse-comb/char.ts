import { Combinator, CombinatorResult } from './combinator';

export function char(c: string): Combinator {
    return (input: string): CombinatorResult => {
        if (input[0] === c) {
            return {
                success: true,
                value: c,
                rest: input.slice(1),
            };
        }

        return {
            success: false,
        };
    };
}
