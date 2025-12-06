import { Arguments, Argv, CommandModule } from "yargs";

export interface CreateArguments extends Arguments {
    year: number;
    day: number;
}

export class CreateCommand implements CommandModule {
    command: string = "create [day]";
    describe: string = "Create scaffolding for a new AoC day";

    builder(args: Argv): Argv {
        return args.positional("day", {
            type: "number",
            describe: "Day to create scaffolding for",
            default: new Date().getDay() + 1,
        });
    }

    async handler(rawArgs: Arguments) {
        const args = rawArgs as CreateArguments;

        const cmdCreate = await import("../app/create");

        await cmdCreate.create(args.year, args.day);
    }
}
