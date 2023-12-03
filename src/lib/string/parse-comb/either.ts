import { Combinator, CombinatorResult } from './combinator';

export function either(...combinators): Combinator {
    return (input): CombinatorResult => {
        for (const combinator of combinators) {
            const result = combinator(input);
            if (result.success) {
                return result;
            }
        }
        return {
            success: false,
        };
    };
}
