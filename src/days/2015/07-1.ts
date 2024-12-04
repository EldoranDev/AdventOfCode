import {} from "@lib/input";

type WireMap = { [wire: string]: () => number };

const REF = /^(\w+) -> (\w+)/;
const AND = /^(\w+) AND (\w+) -> (\w+)/;
const OR = /^(\w+) OR (\w+) -> (\w+)/;
const LSHIFT = /^(\w+) LSHIFT (\w+) -> (\w+)/;
const RSHIFT = /^(\w+) RSHIFT (\w+) -> (\w+)/;
const NOT = /^NOT (\w+) -> (\w+)/;

const wires: WireMap = {};
const results: { [key: string]: number } = {};

export default function (input: string[]) {
    for (const line of input) {
        let result = REF.exec(line);

        if (result !== null) {
            wires[result[2]] = function ref() {
                return getValue(result[1]);
            };
            continue;
        }

        result = AND.exec(line);
        if (result !== null) {
            wires[result[3]] = function and() {
                const cache = new Uint16Array(3);

                cache[0] = getValue(result[1]);
                cache[1] = getValue(result[2]);
                cache[2] = cache[0] & cache[1];

                return cache[2];
            };
            continue;
        }

        result = OR.exec(line);
        if (result !== null) {
            wires[result[3]] = function or() {
                const cache = new Uint16Array(3);

                cache[0] = getValue(result[1]);
                cache[1] = getValue(result[2]);
                cache[2] = cache[0] | cache[1];

                return cache[2];
            };
            continue;
        }

        result = LSHIFT.exec(line);
        if (result !== null) {
            wires[result[3]] = function lshift() {
                const cache = new Uint16Array(3);

                cache[0] = getValue(result[1]);
                cache[1] = getValue(result[2]);
                cache[2] = cache[0] << cache[1];

                return cache[2];
            };
            continue;
        }

        result = RSHIFT.exec(line);
        if (result !== null) {
            wires[result[3]] = function rshift() {
                const cache = new Uint16Array(3);

                cache[0] = getValue(result[1]);
                cache[1] = getValue(result[2]);
                cache[2] = cache[0] >> cache[1];

                return cache[2];
            };
            continue;
        }

        result = NOT.exec(line);
        if (result !== null) {
            wires[result[2]] = () => {
                const cache = new Uint16Array(3);

                cache[0] = getValue(result[1]);
                cache[2] = ~cache[0];

                return cache[2];
            };
            continue;
        }
    }

    return getValue("a");
}

function isNumeric(input: string): boolean {
    return /^\d+$/.test(input);
}

function getValue(input: string): number {
    if (results[input] == undefined) {
        results[input] = isNumeric(input) ? Number(input) : wires[input]();
    }

    return results[input];
}
