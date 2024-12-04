import {} from "@lib/input";
import { Context } from "@app/types";

const MUL = /mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)/;
const DO = /do\(\)/;
const DONT = /don't\(\)/;

export default function (input: string[], { logger }: Context) {
    let sum = 0;
    let current = true;

    for (let i = 0; i < input.length; i++) {
        let line = input[i];

        while (line.length > 0) {
            if (current) {
                const nd = line.match(DONT);
                const nm = line.match(MUL);

                if (nd === null && nm === null) {
                    line = "";
                    continue;
                }

                if (nd === null || nd.index > nm.index) {
                    sum += Number(nm.groups["a"]) * Number(nm.groups["b"]);
                    line = line.substring(nm.index + nm[0].length);
                } else {
                    current = false;
                    line = line.substring(nd.index + nd[0].length);
                }
            } else {
                const nd = line.match(DO);

                if (nd === null) {
                    line = "";
                } else {
                    current = true;
                    line = line.substring(nd.index + nd[0].length);
                }
            }
        }
    }

    return sum;
}
