import {} from "@lib/input";
import { Context } from "@app/types";
import { createHash } from "crypto";

export default function (input: string[], { logger }: Context) {
    const roomId = input[0];
    let id = 0;

    let password = "";

    while (password.length < 8) {
        const md5 = createHash("md5");
        const current = md5.update(`${roomId}${id}`).digest("hex").toString();

        if (current.startsWith("00000")) {
            logger.debug(`Found at ${id} -> ${current} -> ${current.charAt(5)}`);

            password += current.charAt(5);
            logger.debug(password);
        }

        id++;
    }

    return password;
}
