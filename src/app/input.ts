import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { system as logger } from "@app/logger";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export const getInput = (year: number, day: string, test: boolean): string[] => {
    let file = `${day}.in`;

    if (test) {
        file += "-test";
    }

    let input: string;

    try {
        input = readFileSync(resolve(__dirname, "..", "..", "inputs", year.toString(), file), {
            encoding: "utf-8",
        });
    } catch (e) {
        switch (e.code) {
            case "ENOENT":
                logger.error("Input file for day is missing");
                break;
            default:
                console.error(e);
                break;
        }

        process.exit(1);
    }

    let lines = input.split("\n");

    if (lines[lines.length - 1].trim().length === 0) {
        lines = lines.slice(0, lines.length - 1);
    }

    return lines;
};
