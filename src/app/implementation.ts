import type { Implementation } from "./types";

import { system as logger } from "@app/logger";

export const getImplementation = async (
    year: number,
    day: string,
    part: number,
): Promise<Implementation> => {
    try {
        return (await import(`../days/${year}/${day}-${part}`)).default as Implementation;
    } catch (e) {
        switch (e.code) {
            case "MODULE_NOT_FOUND":
                logger.error("Day has no implementation yet");
                break;
            default:
                console.error(e);
        }

        process.exit(1);
    }
};
