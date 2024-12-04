import { createHash } from "crypto";

import {} from "@lib/input";

export default function (input: string[]) {
    const key = input[0];

    for (let i = 1; ; i++) {
        const out = createHash("md5")
            .update(key + i.toString())
            .digest("hex");

        if (out.startsWith("00000")) {
            console.log(out);
            return i;
        }
    }
}
