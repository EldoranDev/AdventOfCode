import { readFile } from "fs/promises";
import { resolve } from "path";
import { Logger } from "winston";
import { Arguments, Argv, CommandModule } from "yargs";

export interface RunArguments extends Arguments {
    year: number;
    day: number;
    part: number;
    verbose: boolean;
    test: boolean;
    submit: boolean;
}

type Implementation = (input: string[], context: any) => string;

export class RunCommand implements CommandModule {
    command = 'run [day] [part]';

    constructor(
        private logger: Logger,
    ) {}

    builder(args: Argv): Argv {
        return args
            .positional('day', {
                describe: 'The day to run',
                default: (new Date()).getDay() + 1,
            })
            .positional('part', {
                describe: 'The part to run',
                default: 1,
            })
            .option('verbose', {
                boolean: true,
                default: false,
            })
            .option('test', {
                boolean: true,
                default: false,
            })
            .option('submit', {
                boolean: true,
                default: false,
            })
    }

    async handler(raw: Arguments, exitProcess = true) {
        const args = raw as RunArguments;

        if (args.verbose) {
            this.logger.level = 'debug';
        }

        const day = (args.day.toString()).padStart(2, '0');

        let module: Implementation;

        try {
            module = (await import(resolve(import.meta.dir, '..', 'days', args.year.toString(), `${day}-${args.part}`))).default as Implementation;
        } catch (e) {
            console.log(e);
            return;
        }

        let file = `${day}.in`;

        if (args.test) {
            file += '-test';
            args.submit = false;
        }

        let input: string;

        try {
            input = await readFile(resolve(import.meta.dir, '..', '..', 'inputs', args.year.toString(), file), 'utf-8');
        } catch (error) {
            console.log(error);
            return;
        }

        const lines = input.split('\n');

        if (lines[lines.length - 1].trim().length === 0) {
            lines.pop();
        }

        try {
            const result = module(lines, {});

            console.log(Promise.resolve(result));
        } catch (error) {
            console.log(error);
            return;
        }
    }
}
