#!/usr/bin/env -S npx tsx
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { BenchCommand } from "src/cmds/bench";
import { RunCommand } from "src/cmds/run";

yargs(hideBin(process.argv))
    .strict()
    .help()
    .option("year", {
        default: new Date().getFullYear(),
        describe: "Year of AoC to use",
    })
    .command(
        "create [day]",
        "Create scaffolding for a new AoC day",
        (y) => {
            y.positional("day", {
                type: "number",
                describe: "Day to create scaffolding for",
                default: new Date().getDay() + 1,
            });
        },
        async (args) => {
            const cmdCreate = await import("./src/app/create");
            const cmdGet = await import("./src/app/get");

            await Promise.all([cmdCreate.create(args), cmdGet.get(args)]);
        },
    )
    .command(
        "get [day]",
        "Get input for day",
        (y) => {
            y.positional("day", {
                type: "number",
                describe: "Day to execute",
                default: new Date().getDay() + 1,
            });
        },
        async (args) => {
            const cmd = await import("./src/app/get");
            await cmd.get(args);
        },
    )
    .command(new RunCommand())
    .command(new BenchCommand())
    .parse();
