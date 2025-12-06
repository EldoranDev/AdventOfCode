import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { writeFileSync, accessSync, mkdirSync } from "node:fs";

import { system as logger } from "./logger";
import provideInput from "./provider/input";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const template = `import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {

}
`;

export async function create(year: number, day: number) {
    const dayPadded = day.toString().padStart(2, "0");

    await provideInput(year, day);

    const path = resolve(__dirname, "..", "days", year.toString());

    try {
        accessSync(path);
    } catch (e) {
        mkdirSync(path);
    }

    writeFileSync(resolve(path, `${dayPadded}-1.ts`), template, {
        encoding: "utf-8",
    });

    writeFileSync(resolve(path, `${dayPadded}-2.ts`), template, {
        encoding: "utf-8",
    });

    logger.info(`Created solution files for ${day} of year ${year}`);
}
