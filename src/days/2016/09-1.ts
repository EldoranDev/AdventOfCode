import {} from "@lib/input";
import { Context } from "@app/types";

const DETECTOR = /\((\d+)x(\d+)\)/;

export default function (input: string[], { logger }: Context) {
    let message = input[0];

    let match: RegExpMatchArray;

    match = message.match(DETECTOR);

    let length = 0;

    while (match !== null) {
        // Count the characters before the marker
        length += getLength(message.slice(0, Math.max(0, match.index)));

        // Extract the marked text
        // eslint-disable-next-line max-len
        const markedText = message.slice(
            match.index + match[0].length,
            match.index + match[0].length + parseInt(match[1], 10),
        );

        length += parseInt(match[2], 10) * getLength(markedText);

        message = message.substring(match.index + match[0].length + parseInt(match[1], 10));

        match = message.match(DETECTOR);
    }

    length += getLength(message);

    return length;
}

function getLength(content: string): number {
    return content.length;
}
