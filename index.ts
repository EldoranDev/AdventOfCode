import yargs from 'yargs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as clipboard from 'clipboardy';
import { performance } from 'perf_hooks';

import { Context } from 'src/app/types';
import answerProvider from '@app/provider/answer';
import observerPerformance from './src/app/performance';
import { system as logger, implementation as implLogger } from './src/app/logger';

type Implementation = (input: string[], context: Context) => string;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(process.argv.slice(2))
    .strict()
    .help()
    .option('year', {
        default: (new Date()).getFullYear(),
        describe: 'Year of AoC to use',
    })
    .command(
        'create [day]',
        'Create scaffolding for a new AoC day',
        (y) => {
            y
                .positional('day', {
                    describe: 'Day to create scaffolding for',
                    default: (new Date()).getDay() + 1,
                });
        },
        async (args) => {
            const cmdCreate = await import('./src/app/create');
            const cmdGet = await import('./src/app/get');

            await Promise.all([
                cmdCreate.create(args),
                cmdGet.get(args),
            ]);
        },
    )
    .command('get [day]', 'Get input for day', (y) => {
        y
            .positional('day', {
                describe: 'Day to execute',
                default: (new Date()).getDay() + 1,
            });
    }, async (args) => {
        const cmd = await import('./src/app/get');
        await cmd.get(args);
    })
    .command(
        'run [day] [part]',
        'Run implementation of day',
        (y) => {
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
                .option('verbose', {
                    boolean: true,
                    default: false,
                })
                .option('submit', {
                    boolean: true,
                    default: false,
                });
        },
        async (args) => {
            if (args.perf) {
                observerPerformance();
            }

            if (!args.verbose) {
                implLogger.level = 'info';
            }

            performance.mark('start-exec');

            const day = (args.day.toString()).padStart(2, '0');

            let module: Implementation;

            performance.mark('mod-load-start');

            try {
                module = (await import(`./src/days/${args.year}/${day}-${args.part}`)).default as Implementation;
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

            performance.mark('input-start');
            let file = `${day}.in`;

            if (args.test) {
                file += '-test';
                args.submit = false;
            }

            let input: string;

            try {
                input = readFileSync(
                    resolve(__dirname, 'inputs', args.year.toString(), file),
                    {
                        encoding: 'utf-8',
                    },
                );
            } catch (e) {
                switch (e.code) {
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

            if (lines[lines.length - 1].trim().length === 0) {
                lines = lines.slice(0, lines.length - 1);
            }

            performance.mark('input-end');

            performance.mark('exec-start');
            try {
                const result = module(lines, {
                    logger: implLogger,
                    test: args.test,
                });
                performance.mark('exec-end');

                if (result == undefined) {
                    logger.error('No result returned');
                    return;
                }

                await clipboard.write(result.toString());

                performance.measure('Module Loading', 'mod-load-start', 'mod-load-end');
                performance.measure('Input Loading', 'input-start', 'input-end');
                performance.measure('Execution', 'exec-start', 'exec-end');

                logger.info(`💬 Result: ${result.toString()}`);

                if (args.submit) {
                    answerProvider(args.year, args.day as number, args.part as number, result.toString());
                }
            } catch (e) {
                console.error(e);
            }
        },
    )
    .command(
        'vis [day]',
        'Run visualization of day',
        (y) => {
            y
                .positional('day', {
                    describe: 'Day to execute',
                    default: (new Date()).getDay() + 1,
                })
                .option('test', {
                    boolean: true,
                    default: false,
                });
        },
        async (args) => {
            const day = (args.day.toString()).padStart(2, '0');

            let module: Implementation;

            try {
                module = (await import(`./src/visuals/${args.year}/${day}`)).default as Implementation;
            } catch (e) {
                switch (e.code) {
                    case 'MODULE_NOT_FOUND':
                        logger.error('Day has no visuals yet');
                        break;
                    default:
                        console.error(e);
                }
                return;
            }

            let file = `${day}.in`;

            if (args.test) {
                file += '-test';
                args.submit = false;
            }

            let input: string;

            try {
                input = readFileSync(
                    resolve(__dirname, 'inputs', args.year.toString(), file),
                    {
                        encoding: 'utf-8',
                    },
                );
            } catch (e) {
                switch (e.code) {
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

            if (lines[lines.length - 1].trim().length === 0) {
                lines = lines.slice(0, lines.length - 1);
            }

            try {
                module(lines, {
                    logger: implLogger,
                });
            } catch (e) {
                logger.error(e);
            }
        },
    )
    .argv;
