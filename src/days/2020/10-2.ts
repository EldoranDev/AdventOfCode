import { mapToNumber } from '@lib/input';

export default function (input: string[]) {
    const adapters = [0, ...mapToNumber(input)].sort((a, b) =>  b - a);
    
    let ways: Record<number, number> = {};

    ways[adapters[0] + 3] = 1;

    for (let adapter of adapters) {
        ways[adapter] = [1, 2, 3].reduce((sum, gap) => {
            return ways[adapter+gap] ? ways[adapter+gap] + sum : sum;
        }, 0);
    }

    return ways[0];
};