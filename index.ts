import yargs from 'yargs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as clipboard  from 'clipboardy';

import { performance } from 'perf_hooks';
import observerPerformance from './src/app/performance';

type implementation = (input: string[]) => string;

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
        
        await cmd.create(args);
    })
    .command('get [day]', 'Get input for day', (y) => {
        y
        .positional('day', {
            describe: 'Day to execute',
            default: (new Date()).getDay() + 1,
        })
    }, async (args) => {
        const cmd = await import('./src/app/get');
        await cmd.get(args);
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
        .option('test', {
            boolean: true,
            default: false,
        })
        .option('perf', {
            boolean: true,
            default: false,
        })
    }, 
    async (args) => {
        if (args.perf) {
            observerPerformance();
        }

        performance.mark('start-exec');

        const day = (args.day.toString()).padStart(2, '0');

        let module: implementation;

        performance.mark('mod-load-start');

        try {
            module = (await import(`./src/days/${day}-${args.part}`)).default as implementation;
        } catch (e) {
            console.log(e);
            console.error('Day has no implementation yet');
            return;
        }

        performance.mark('mod-load-end');

        performance.mark('input-start')
        let file = `${day}.in`;

        if (args.test) {
            file += '-test';
        }

        const input = readFileSync(
            resolve(__dirname, 'inputs', file),
            {
                encoding: 'utf-8'
            }
        );
        
        const lines = input.split('\n');

        performance.mark('input-end');
        
        performance.mark('exec-start');
        const result = module(lines.slice(0, lines.length-1));
        performance.mark('exec-end');

        await clipboard.write(result.toString());

        performance.measure('Module Loading', 'mod-load-start', 'mod-load-end');
        performance.measure('Input Loading', 'input-start', 'input-end');
        performance.measure('Execution','exec-start', 'exec-end');

        console.log(result);
    })
    .argv;