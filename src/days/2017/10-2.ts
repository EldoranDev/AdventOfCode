import {} from "@lib/input";
import { Context } from "@app/types";
import { knot } from "./hash/knot";

export default function (input: string[], { logger, test }: Context) {
    const hash = knot(input[0]);

    return hash.asHex();
}
