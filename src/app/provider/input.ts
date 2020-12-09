import fetch from 'node-fetch';

import { resolve } from 'path';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';

export default async (year: number, day: number) => {
    const session = readFileSync(
        resolve(__dirname, '..', '..', '..', '.session'),
    );

    const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {
            'Cookie': `session=${session}`,
        },
    });

    const fileName = (day.toString()).padStart(2, '0');

    const file = createWriteStream(
        resolve(__dirname, '..', '..', '..', 'inputs', `${fileName}.in`)
    );

    writeFileSync(resolve(__dirname, '..', '..', '..', 'inputs', `${fileName}.in-test`), '');

    response.body.pipe(file);
}