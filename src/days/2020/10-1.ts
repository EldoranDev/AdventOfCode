import { mapToNumber } from '@lib/input';

export default function (input: string[]) {
    const list = mapToNumber(input);

    list.sort((a, b) => a - b);

    const jolts: Record<number, number> = {};

    let current = 0; 

    for (let adapter of list) {
        let diff = adapter-current;

        if (!jolts[diff]){
            jolts[diff] = 0;
        }

        jolts[diff]++;

        current = adapter;
    }
    
    jolts[3]++;
    console.log(jolts);
    return jolts[1] * jolts[3];
};