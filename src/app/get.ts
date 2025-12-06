import provideInput from "./provider/input";
import { system as logger } from "./logger";

export async function get(year: number, day: number) {
    try {
        await provideInput(year, day);
        logger.info(`Added input for day ${day} of year ${year}`);
    } catch (e) {
        console.log(e);
        switch (e.code) {
            case "ENOENT":
                logger.error("Missing session file");
                break;
            default:
                logger.error(e);
        }
    }
}
