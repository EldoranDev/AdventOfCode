import { Arguments, Argv, CommandModule } from "yargs";

export interface GetArguments extends Arguments {
    year: number;
    day: number;
}

export class GetCommand implements CommandModule {
    command: string = "get [day]";
    describe: string = "Get the Input for a day";

    builder(args: Argv): Argv {
        return args.positional("day", {
            type: "number",
            describe: "Day to create scaffolding for",
            default: new Date().getDay() + 1,
        });
    }

    async handler(rawArgs: Arguments) {
        const args = rawArgs as GetArguments;

        const cmdGet = await import("../app/get");

        await cmdGet.get(args.year, args.day);
    }
}
