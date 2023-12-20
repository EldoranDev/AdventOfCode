/* eslint-disable class-methods-use-this */
import { } from '@lib/input';
import { Context } from '@app/types';
import { LCM } from '@lib/math/functions';

interface Pulse {
    from: string;
    to: string;
    pulse: State;
}

type State = boolean;

abstract class Module {
    public readonly parent: Array<string> = [];

    constructor(
        public id: string,
        public targets: string[],
    ) { }

    public abstract process(pulse: Pulse): Pulse[];

    public connect(target: string): void {
        this.parent.push(target);
    }
}

class FlipFlop extends Module {
    private state: State = false;

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

class Conjunction extends Module {
    private memory: { [key: string]: State } = {};

    public process(pulse: Pulse): Pulse[] {
        this.memory[pulse.from] = pulse.pulse;

        const p = !Object.values(this.memory).every((state) => state);

        return this.targets.map((target) => ({
            from: this.id,
            to: target,
            pulse: p,
        }));
    }

    public override connect(target: string): void {
        super.connect(target);

        this.memory[target] = false;
    }
}

class Broadcaster extends Module {
    public process(pulse: Pulse): Pulse[] {
        return this.targets.map((target) => ({
            from: this.id,
            to: target,
            pulse: pulse.pulse,
        }));
    }
}

class Untyped extends Module {
    public process(pulse: Pulse): Pulse[] {
        return [];
    }
}

// Target we're looking for
const TARGET = 'rx';

export default function (input: string[], { logger }: Context) {
    const modules: Map<string, Module> = new Map();

    input.forEach((line) => {
        const [type, id, targets] = /([&%]?)([a-z]+) -> (.+)/.exec(line).slice(1);

        switch (type) {
            case '%':
                modules.set(id, new FlipFlop(id, targets.split(',').map((target) => target.trim())));
                break;
            case '&':
                modules.set(id, new Conjunction(id, targets.split(',').map((target) => target.trim())));
                break;
            case '':
                modules.set(id, new Broadcaster(id, targets.split(',').map((target) => target.trim())));
                break;
            default:
                throw new Error(`Unknown type: ${type}`);
        }
    });

    // Untyped output module for testing purposes
    // Required for one of the test inputs
    modules.set('output', new Untyped('output', []));

    // Untyped rx module for P2
    modules.set(TARGET, new Untyped(TARGET, []));

    modules.forEach((module) => {
        module.targets.forEach((target) => {
            const targetModule = modules.get(target)!;

            targetModule.connect(module.id);
        });
    });

    const observed = new Set<string>();
    const points: { [key: string]: Array<number> } = {};

    // find the conjunction module that is determining the output
    modules.get(modules.get(TARGET)!.parent[0])!.parent.forEach((target) => {
        observed.add(target);
    });

    const pulses: Array<Pulse> = [];
    for (let i = 0; /* Search until we find answer */ ; i++) {
        pulses.push({
            from: 'button',
            to: 'broadcaster',
            pulse: false,
        });

        // Process pulses until system is settled
        while (pulses.length > 0) {
            const pulse = pulses.shift()!;

            // Unrealistic, but check for direct solution
            if (pulse.to === TARGET && !pulse.pulse) {
                return i;
            }

            const module = modules.get(pulse.to)!;

            if (module === undefined) {
                continue;
            }

            const np = module.process(pulse);

            if (np.length === 0) {
                continue;
            }

            if (observed.has(pulse.to)) {
                if (np[0].pulse) {
                    points[pulse.to] = points[pulse.to] ?? [];
                    points[pulse.to].push(i);
                }
            }

            pulses.push(...np);
        }

        if (Object.values(points).length === observed.size) {
            logger.info(`Found solution after ${i} iterations`);
            break;
        }
    }

    return Object.values(points).map((p) => p[0] + 1).reduce((a, b) => LCM(a, b), 1);
}
