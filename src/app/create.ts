import fetch from 'node-fetch';

import { resolve } from 'path';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';

const template = 
`export default function (input: string[]) {

};`;

export async function create(args) {
    const session = readFileSync(
        resolve(__dirname, '..', '..', '.session'),
    );

    const response = await fetch(`https://adventofcode.com/${args.year}/day/${args.day}/input`, {
        headers: {
            'Cookie': `session=${session}`,
        },
    });

    const day = (args.day.toString()).padStart(2, '0');

    const file = createWriteStream(
        resolve(__dirname, '..', '..', 'inputs', `${day}.in`)
    );

    writeFileSync(resolve(__dirname, '..', '..', 'inputs', `${day}.in-test`), '');

    response.body.pipe(file);

    writeFileSync(
        resolve(__dirname, '..', 'days', `${day}-1.ts`), template,
        {
            encoding: 'utf-8',
        }
    );

    writeFileSync(
        resolve(__dirname, '..', 'days', `${day}-2.ts`), template,
        {
            encoding: 'utf-8',
        }
    );
}