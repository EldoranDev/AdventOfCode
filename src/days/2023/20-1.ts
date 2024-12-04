/* eslint-disable class-methods-use-this */
import {} from "@lib/input";
import { Context } from "@app/types";

interface Pulse {
    from: string;
    to: string;
    pulse: State;
}

type State = boolean;

interface Module {
    id: string;
    targets: string[];
    process(pulse: Pulse): Pulse[];
}

class FlipFlop implements Module {
    private state: State = false;

    constructor(
        public id: string,
        public targets: string[],
    ) {}

    public process(pulse: Pulse): Pulse[] {
        // High pulses are ignored
        if (pulse.pulse) {
            return [];
        }

        this.state = !this.state;

        return this.targets.map((target) => ({
            from: this.id,
            to: target,
            pulse: this.state,
        }));
    }
}

class Conjunction implements Module {
    private memory: { [key: string]: State } = {};

    constructor(
        public id: string,
        public targets: string[],
    ) {}

    public process(pulse: Pulse): Pulse[] {
        this.memory[pulse.from] = pulse.pulse;

        const p = !Object.values(this.memory).every((state) => state);

        return this.targets.map((target) => ({
            from: this.id,
            to: target,
            pulse: p,
        }));
    }

    public connect(target: string): void {
        this.memory[target] = false;
    }
}

class Broadcaster implements Module {
    constructor(
        public id: string,
        public targets: string[],
    ) {}

    public process(pulse: Pulse): Pulse[] {
        return this.targets.map((target) => ({
            from: this.id,
            to: target,
            pulse: pulse.pulse,
        }));
    }
}

class Untyped implements Module {
    constructor(
        public id: string,
        public targets: string[] = [],
    ) {}

    public process(pulse: Pulse): Pulse[] {
        return [];
    }
}

// How many button presses to simulate
// Will go incredebly high for P2 so I assume remembering states and summing
// them up will be required for P2
const LIMIT = 1_000;

export default function (input: string[], { logger }: Context) {
    const modules: Map<string, Module> = new Map();

    input.forEach((line) => {
        const [type, id, targets] = /([&%]?)([a-z]+) -> (.+)/.exec(line).slice(1);

        switch (type) {
            case "%":
                modules.set(
                    id,
                    new FlipFlop(
                        id,
                        targets.split(",").map((target) => target.trim()),
                    ),
                );
                break;
            case "&":
                modules.set(
                    id,
                    new Conjunction(
                        id,
                        targets.split(",").map((target) => target.trim()),
                    ),
                );
                break;
            case "":
                modules.set(
                    id,
                    new Broadcaster(
                        id,
                        targets.split(",").map((target) => target.trim()),
                    ),
                );
                break;
            default:
                throw new Error(`Unknown type: ${type}`);
        }
    });

    modules.forEach((module) => {
        module.targets.forEach((target) => {
            const targetModule = modules.get(target)!;

            if (targetModule instanceof Conjunction) {
                targetModule.connect(module.id);
            }
        });
    });

    // Untyped output module for testing purposes
    // Required for one of the test inputs
    modules.set("output", new Untyped("output"));

    const pulses: Array<Pulse> = [];

    const counter = [0, 0];

    for (let i = 0; i < LIMIT; i++) {
        pulses.push({
            from: "button",
            to: "broadcaster",
            pulse: false,
        });

        // Process pulses until system is settled
        while (pulses.length > 0) {
            const pulse = pulses.shift()!;

            counter[+pulse.pulse]++;
            // console.log(`${pulse.from} -${pulse.pulse}-> ${pulse.to}`);

            const module = modules.get(pulse.to)!;

            if (module === undefined) {
                continue;
            }

            pulses.push(...module.process(pulse));
        }
    }

    return counter[0] * counter[1];
}
