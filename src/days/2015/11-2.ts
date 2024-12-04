/* eslint-disable no-param-reassign */
import {} from "@lib/input";
import { Context } from "@app/types";

const CHAR_CODE_A = "a".charCodeAt(0);
const CHAR_CODE_Z = "z".charCodeAt(0);

const FORBIDDEN = ["i", "o", "l"].map((c) => c.charCodeAt(0));

export default function (input: string[], { logger }: Context) {
    const password = input[0];

    // eslint-disable-next-line prefer-const
    let pw = password.split("").map((c) => c.charCodeAt(0));

    for (;;) {
        getNextPassword(pw);

        if (isValid(pw)) {
            break;
        }
    }

    for (;;) {
        getNextPassword(pw);

        if (isValid(pw)) {
            return pw.map((c) => String.fromCharCode(c)).join("");
        }
    }
}

function getNextPassword(pw: Array<number>): void {
    let skippables = true;
    let didSkip = false;

    while (skippables) {
        skippables = false;

        for (const c of FORBIDDEN) {
            const index = pw.indexOf(c);

            if (index !== -1) {
                skippables = true;
                didSkip = true;
                increase(pw, index);
            }
        }
    }

    if (!didSkip) {
        increase(pw, pw.length - 1);
    }
}

function increase(pw: Array<number>, index: number): void {
    pw[index]++;

    for (let i = index + 1; i < pw.length; i++) {
        pw[i] = CHAR_CODE_A;
    }

    let carry = pw[index] > CHAR_CODE_Z;

    while (carry) {
        pw[index] = CHAR_CODE_A;
        index--;

        if (index < 0) {
            throw new Error("Could not find a new Password");
        }

        pw[index]++;
        carry = pw[index] > CHAR_CODE_Z;
    }
}

function isValid(pw: Array<number>): boolean {
    // No need to check for forbidden, thats already done in getNextPassword

    let hasStraight = false;

    for (let i = 0; i < pw.length - 2; i++) {
        if (pw[i] === pw[i + 1] - 1 && pw[i] === pw[i + 2] - 2) {
            hasStraight = true;
            break;
        }
    }

    if (!hasStraight) {
        return false;
    }

    let pairs = 0;

    for (let i = 0; i < pw.length - 1; i++) {
        if (pw[i] === pw[i + 1]) {
            pairs++;
            i++;
        }
    }

    return pairs >= 2;
}
