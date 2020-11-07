import yargs from 'yargs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

type implementation = (input: string[]) => {};

yargs(process.argv.slice(2))
    .strict()
    .help()
    .option('year', {
        default: (new Date()).getFullYear(),
        describe: 'Year of AoC to use'
    })
    .command('create [day]', 'Create scaffolding for a new AoC day', (y) => {
        y
        .positional('day', {
            describe: 'Day to create scaffolding for',
            default: (new Date()).getDay() + 1,
        })
    },
    async (args) => {
        const cmd = await import('./src/app/create');
        
        cmd.create(args);
    })
    .command('run [day] [part]', 'Run implementation of day', (y) => {
        y
        .positional('day', {
            describe: 'Day to execute',
            default: (new Date()).getDay() + 1,
        })
        .positional('part', {
            describe: 'Part of day to execute',
            default: 1,
        })
    }, 
    async (args) => {
        const day = (args.day.toString()).padStart(2, '0');

        let module: implementation;

        try {
            module = (await import(`./src/days/${day}-${args.part}`)).default as implementation;
        } catch (e) {
            console.error('Day has no implementation yet');
            return;
        }

        const input = readFileSync(
            resolve(__dirname, 'inputs', `${day}.in`),
            {
                encoding: 'utf-8'
            }
        );

        const lines = input.split('\n');
        
        module(lines.slice(0, lines.length-1));        
    })
    .argv;
    