import {} from "@lib/input";

export default function (input: string[]) {
    const target = Number(input[0]);

    const lowest = {
        id: null,
        time: null,
    };

    console.log(target);
    for (const bus of input[1].split(",").map((b) => Number(b))) {
        if (Number.isNaN(bus)) continue;

        const diff = target % bus;
        const depart = target - diff + bus;
        const waiting = depart - target;

        if (lowest.time === null || lowest.time > waiting) {
            lowest.time = waiting;
            lowest.id = bus;
        }
    }

    return lowest.time * lowest.id;
}
