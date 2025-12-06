#!/usr/bin/env -S npx tsx
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { BenchCommand } from "src/cmds/bench";
import { RunCommand } from "src/cmds/run";
import { CreateCommand } from "src/cmds/create";
import { GetCommand } from "src/cmds/get";

yargs(hideBin(process.argv))
    .strict()
    .help()
    .option("year", {
        default: new Date().getFullYear(),
        describe: "Year of AoC to use",
    })
    .command(new CreateCommand())
    .command(new GetCommand())
    .command(new RunCommand())
    .command(new BenchCommand())
    .parse();
