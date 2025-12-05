import { Arguments, Argv, CommandModule } from "yargs";
import clipboard from "clipboardy";

import answerProvider from "@app/provider/answer";
import observerPerformance from "@app/performance";
import { system as logger, implementation as implLogger } from "@app/logger";
import { getImplementation } from "@app/implementation";
import { getInput } from "@app/input";

export interface RunArguments extends Arguments {
    year: number;
    day: number;
    part: number;
    verbose: boolean;
    test: boolean;
    submit: boolean;
}

export class RunCommand implements CommandModule {
    command = "run [day] [part]";

    builder(args: Argv): Argv {
        return args
            .positional("day", {
                describe: "Day to execute",
                default: new Date().getDay() + 1,
            })
            .positional("part", {
                describe: "Part of day to execute",
                default: 1,
            })
            .option("test", {
                boolean: true,
                default: false,
            })
            .option("perf", {
                boolean: true,
                default: false,
            })
            .option("verbose", {
                boolean: true,
                default: false,
            })
            .option("submit", {
                boolean: true,
                default: false,
            });
    }

    async handler(rawArgs: Arguments) {
        const args = rawArgs as RunArguments;

        if (args.perf) {
            await observerPerformance();
        }

        if (!args.verbose) {
            implLogger.level = "info";
        }

        if (args.test) {
            args.submit = false;
        }

        performance.mark("start-exec");

        const day = args.day.toString().padStart(2, "0");

        performance.mark("mod-load-start");

        const module = await getImplementation(args.year, day, args.part);

        performance.mark("mod-load-end");

        performance.mark("input-start");

        const lines = getInput(args.year, day, args.test as boolean);

        performance.mark("input-end");

        performance.mark("exec-start");
        try {
            let result = module(lines, {
                logger: implLogger,
                test: args.test as boolean,
            });

            performance.mark("exec-end");

            result = await Promise.resolve(result);

            if (result == undefined) {
                logger.error("No result returned");
                return;
            }

            await clipboard.write(result.toString());

            performance.measure("Module Loading", "mod-load-start", "mod-load-end");
            performance.measure("Input Loading", "input-start", "input-end");
            performance.measure("Execution", "exec-start", "exec-end");

            logger.info(`💬 Result: ${result.toString()}`);

            if (args.submit) {
                answerProvider(
                    args.year,
                    args.day as number,
                    args.part as number,
                    result.toString(),
                );
            }
        } catch (e) {
            console.error(e);
        }
    }
}
