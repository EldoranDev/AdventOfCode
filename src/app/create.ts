import { resolve } from 'path';
import { writeFileSync, accessSync, mkdirSync } from 'fs';

import provideInput from './provider/input';

const template = 
`import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], context: Context) {

};`;

export async function create(args) {
    const dayPadded = (args.day.toString()).padStart(2, '0');

    await provideInput(args.year, args.day);

    let path = resolve(__dirname, '..', 'days', args.year.toString());

    try {
        accessSync(path);
    } catch (e) {
        mkdirSync(path);
    }

    writeFileSync(
        resolve(path, `${dayPadded}-1.ts`), template,
        {
            encoding: 'utf-8',
        }
    );

    writeFileSync(
        resolve(path, `${dayPadded}-2.ts`), template,
        {
            encoding: 'utf-8',
        }
    );
}