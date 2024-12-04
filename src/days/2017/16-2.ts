/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
import {} from "@lib/input";
import { Context } from "@app/types";

const ROUNDS = 1_000_000_000;
const START = "abcdefghijklmnop";

export default function (input: string[], { logger, test }: Context) {
    const group = START.split("");
    const actions = input[0].split(",");

    const history = [];

    do {
        history.push(group.join(""));

        dance(group, actions);
    } while (group.join("") !== START);

    return history[ROUNDS % history.length];
}

function dance(group: string[], actions: string[]) {
    for (const action of actions) {
        perform(action, group);
    }
}

function perform(action: string, group: string[]) {
    switch (action[0]) {
        case "s":
            const [, count] = /s(.+)/.exec(action);

            for (let i = 0; i < Number(count); i++) {
                group.unshift(group.pop());
            }

            break;
        case "x":
            const [, x1, x2] = /x(.+)\/(.+)/.exec(action);

            const tmpX = group[x1];
            group[x1] = group[x2];
            group[x2] = tmpX;

            break;
        case "p":
            const [, p1, p2] = /p(.+)\/(.+)/.exec(action);

            const ip1 = group.indexOf(p1);
            const ip2 = group.indexOf(p2);

            const tmpP = group[ip1];
            group[ip1] = group[ip2];
            group[ip2] = tmpP;

            break;
        default:
            throw new Error("Invalid dance move");
    }
}
