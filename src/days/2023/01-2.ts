import {} from "@lib/input";
import { Context } from "@app/types";

const mapping = new Map<string, string>([
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"],
]);
const reverseMapping = new Map<string, string>();

const reg = /(\d|one|two|three|four|five|six|seven|eight|nine)/;
const rreg = /(\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)/;

export default function (input: string[], { logger }: Context) {
    mapping.forEach((value, key) => reverseMapping.set(reverseString(key), value));

    return input.reduce((acc, line) => {
        const [, first] = reg.exec(line);
        const [, last] = rreg.exec(reverseString(line));

        return (
            acc +
            parseInt(
                `${mapping.get(first) ?? first}${mapping.get(reverseString(last)) ?? last}`,
                10,
            )
        );
    }, 0);
}

function reverseString(str: string): string {
    return [...str].reverse().join("");
}
