import yargs from 'yargs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as clipboard  from 'clipboardy';

import { performance } from 'perf_hooks';
import observerPerformance from './src/app/performance';
import { system as logger } from './src/app/logger';

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
            module = (await import(`./src/days/${args.year}/${day}-${args.part}`)).default as implementation;
        } catch (e) {
            switch (e.code) {
                case 'MODULE_NOT_FOUND':
                    logger.error('Day has no implementation yet');
                    break;
                default:
                    console.error(e);
            }
            return;
        }

        performance.mark('mod-load-end');

        performance.mark('input-start')
        let file = `${day}.in`;

        if (args.test) {
            file += '-test';
        }
        
        let input: string;

        try {
            input = readFileSync(
                resolve(__dirname, 'inputs', args.year.toString(), file),
                {
                    encoding: 'utf-8'
                }
            );
        } catch (e) {
            switch(e.code) {
                case 'ENOENT':
                    logger.error('Input file for day is missing');
                    break;
                default:
                    console.error(e);
                    break;
            }
            return;
        }
        
        let lines = input.split('\n');

        if (lines[lines.length-1].trim().length === 0) {
            lines = lines.slice(0, lines.length-1);
        }

        performance.mark('input-end');
        
        performance.mark('exec-start');
        const result = module(lines);
        performance.mark('exec-end');

        await clipboard.write(result.toString());

        performance.measure('Module Loading', 'mod-load-start', 'mod-load-end');
        performance.measure('Input Loading', 'input-start', 'input-end');
        performance.measure('Execution','exec-start', 'exec-end');

        logger.info(`Result: ${result.toString()}`);
    })
    .argv;