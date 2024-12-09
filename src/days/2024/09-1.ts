import {} from "@lib/input";
import { Context } from "@app/types";

export default function ([line]: string[], { logger, test }: Context) {
    let id = 0;
    let bwId = (line.length / 2) | 0;

    let fwIdx = 0;
    let bwIdx = 0;

    let bi = 0;

    const solution = [];

    let hasLeftovers = true;

    // Move forward while we didn't reach the end of the input
    // and make sure that we don't use the
    while (fwIdx < line.length - bwIdx - 1) {
        const c = Number(line[fwIdx]);

        for (let j = 0; j < c; j++) {
            if (fwIdx % 2 === 0) {
                solution.push(id);
            } else {
                solution.push(bwId);

                bi++;

                if (bi >= Number(line[line.length - bwIdx - 1])) {
                    bwIdx += 2;
                    bwId--;
                    bi = 0;

                    console.log(fwIdx, line.length - bwIdx, bwIdx, bwId, bi);

                    if (fwIdx >= line.length - bwIdx - 1) {
                        hasLeftovers = false;
                        break;
                    }
                }
            }
        }

        if (fwIdx % 2 === 0) {
            id++;
        }

        fwIdx++;
    }

    if (hasLeftovers) {
        for (let a = 0; a < Number(line[fwIdx]) - bi; a++) {
            solution.push(id);
        }
    }

    return solution.reduce((prev, curr, i) => prev + curr * i);
}
