import { init } from "z3-solver";

import {} from "@lib/input";
import { Context } from "@app/types";

const EXTRACT = /\[(?<light>[.#]+)\].(?<buttons>\(.*\)).{(?<joltage>.*)}/;

interface Machine {
    lights: boolean[];
    buttons: Array<number[]>;
    joltage: number[];
}

export default async function (input: string[], { logger }: Context) {
    const machines: Machine[] = input.map((l) => {
        const e = EXTRACT.exec(l);

        const lights = e.groups["light"].split("").map((c) => c === "#");
        const buttons = e.groups["buttons"].split(" ").map((b) => {
            return b
                .substring(1, b.length - 1)
                .split(",")
                .map(Number);
        });
        const joltage = e.groups["joltage"].split(",").map(Number);

        return {
            lights,
            buttons,
            joltage,
        };
    });

    let res = 0;

    for (const machine of machines) {
        res += await solve(machine);
    }

    return res;
}

async function solve(machine: Machine): Promise<number> {
    const { Context, em } = await init();

    const { Int, Optimize } = Context("main");
    const opt = new Optimize();

    const presses = machine.buttons.map((_, i) => {
        return Int.const(`press${i}`);
    });

    presses.forEach((p) => {
        opt.add(p.ge(Int.val(0)));
    });

    machine.joltage.forEach((joltage, i) => {
        const terms = presses.filter((_, j) => machine.buttons[j].includes(i));

        let sumExpr;
        if (terms.length === 0) {
            sumExpr = Int.val(0);
        } else {
            sumExpr = terms[0];

            for (let k = 1; k < terms.length; k++) {
                sumExpr = sumExpr.add(terms[k]);
            }
        }

        opt.add(sumExpr.eq(Int.val(joltage)));
    });

    let totalPresses = presses[0];
    for (let i = 1; i < presses.length; i++) {
        totalPresses = totalPresses.add(presses[i]);
    }

    opt.minimize(totalPresses);

    if ((await opt.check()) === "sat") {
        const model = opt.model();

        let result = 0;

        presses.forEach((p) => {
            result += Number(model.get(p).value());
        });

        em.PThread.terminateAllThreads();
        return result;
    }

    em.PThread.terminateAllThreads();
    return Infinity;
}
