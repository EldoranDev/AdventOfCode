import { resolve } from 'path';
import { writeFileSync } from 'fs';

import provideInput from './provider/input';

const template = 
`import { } from '../lib/input';

export default function (input: string[]) {

};`;

export async function create(args) {
    const dayPadded = (args.day.toString()).padStart(2, '0');

    await provideInput(args.year, args.day);

    writeFileSync(
        resolve(__dirname, '..', 'days', `${dayPadded}-1.ts`), template,
        {
            encoding: 'utf-8',
        }
    );

    writeFileSync(
        resolve(__dirname, '..', 'days', `${dayPadded}-2.ts`), template,
        {
            encoding: 'utf-8',
        }
    );
}