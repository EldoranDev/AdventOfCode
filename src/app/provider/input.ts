import fetch from 'node-fetch';

import { resolve } from 'path';
import {
    createWriteStream, readFileSync, writeFileSync, accessSync, mkdirSync,
} from 'fs';

export default async (year: number, day: number) => {
    const session = readFileSync(
        resolve(__dirname, '..', '..', '..', '.session'),
    );

    const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {
            Cookie: `session=${session}`,
        },
    });

    const fileName = (day.toString()).padStart(2, '0');

    const path = resolve(__dirname, '..', '..', '..', 'inputs', year.toString());

    try {
        accessSync(path);
    } catch (e) {
        mkdirSync(path);
    }

    const file = createWriteStream(
        resolve(path, `${fileName}.in`),
    );

    writeFileSync(resolve(path, `${fileName}.in-test`), '');

    response.body.pipe(file);
};
