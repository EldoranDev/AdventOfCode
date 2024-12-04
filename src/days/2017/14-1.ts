import {} from "@lib/input";
import { Context } from "@app/types";
import { knot } from "./hash/knot";

export default function (input: string[], { logger }: Context) {
    let count = 0;

    for (let i = 0; i < 128; i++) {
        const hash = knot(`${input[0]}-${i}`);

        count += hash
            .asBinary()
            .split("")
            .filter((val) => val === "1").length;
    }

    return count;
}
