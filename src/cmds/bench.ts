import { Arguments, Argv, CommandModule } from "yargs";

import { system as logger, implementation as implLogger } from "@app/logger";
import { getImplementation } from "@app/implementation";
import { getInput } from "@app/input";
import { sum } from "@lib/math/functions";

export interface BenchArguments extends Arguments {
    year: number;
    day: number;
    part: number;
    count: number;
    test: boolean;
}

export class BenchCommand implements CommandModule {
    command = "bench [day] [part] [count]";

    builder(args: Argv): Argv {
        return args
            .positional("day", {
                describe: "The day to run",
                default: new Date().getDay() + 1,
            })
            .positional("part", {
                describe: "The part to run",
                default: 1,
            })
            .positional("count", {
                describe: "The number of iterations for the benchmark",
                default: 10,
            })
            .option("test", {
                boolean: true,
                default: false,
            });
    }

    async handler(rawArgs: Arguments) {
        const args = rawArgs as BenchArguments;

        const day = args.day.toString().padStart(2, "0");

        const module = await getImplementation(args.year, day, args.part);
        const lines = getInput(args.year, day, args.test as boolean);

        const times = [];

        for (let i = 0; i < args.count; i++) {
            const start = performance.now();
            module(lines, {
                logger: implLogger,
                test: args.test as boolean,
            });

            times.push(performance.now() - start);
        }

        times.sort((a, b) => b - a);

        logger.info(`Average Time: ${Math.round((sum(...times) / args.count) * 100) / 100}ms`);
        logger.info(`High: ${Math.round(times[0] * 100) / 100}ms`);
        logger.info(`Low: ${Math.round(times[times.length - 1] * 100) / 100}ms`);
    }
}
