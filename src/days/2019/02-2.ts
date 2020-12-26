import { mapToNumber } from '@lib/input';
import VM from '@2019/vm';

export default function (input: string[]) {
    let program = mapToNumber(input[0].split(','));

    let vm = new VM(program);

    let output = 0;

    let noun = 0;
    let verb = 0;

    const target = 19_690_720;
    
    for (; noun < 10_000; noun++) {
        for(verb = 0; verb < 10_000; verb++) {
            vm.reset();
            vm.setMemory(1, noun);
            vm.setMemory(2, verb);

            let output = vm.run();

            if (output === target) return 100*noun + verb;
        }
    }

    

};