import { resolve } from 'path';
import { writeFileSync, accessSync, mkdirSync } from 'fs';

import { system as logger } from './logger';
import provideInput from './provider/input';

const template = `import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {

};`;

export async function create(args) {
    const dayPadded = (args.day.toString()).padStart(2, '0');

    await provideInput(args.year, args.day);

    const path = resolve(__dirname, '..', 'days', args.year.toString());

    try {
        accessSync(path);
    } catch (e) {
        mkdirSync(path);
    }

    writeFileSync(
        resolve(path, `${dayPadded}-1.ts`),
        template,
        {
            encoding: 'utf-8',
        },
    );

    writeFileSync(
        resolve(path, `${dayPadded}-2.ts`),
        template,
        {
            encoding: 'utf-8',
        },
    );

    logger.info(`Created solution files for ${args.day} of year ${args.year}`);
}
