import { } from '@lib/input';

export default function (input: string[]) {
    let target = Number(input[0]);

    let lowest = {
        id: null,
        time: null,
    };

    console.log(target);
    for (let bus of input[1].split(',').map((b) => Number(b))) {
        if (Number.isNaN(bus)) continue;

        let diff = target % bus;
        let depart = target - diff + bus;
        let waiting = depart-target;

        if (lowest.time === null || lowest.time > waiting) {
            lowest.time = waiting;
            lowest.id = bus;
        }
    }

    return lowest.time * lowest.id;
};