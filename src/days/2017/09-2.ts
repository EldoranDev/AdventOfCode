import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const parser = new Parser(input[0].split(""));

    let score = 0;

    while (!parser.atEnd) {
        const token = parser.getNextToken();

        if (token === Token.GARBAGE) {
            score++;
        }
    }

    return score;
}

enum Token {
    GROUP_OPEN,
    GROUP_CLOSE,
    GARBAGE_OPEN,
    GARBAGE_CLOSE,
    IGNORE,
    NOTHING,
    GARBAGE,
    END,
}

class Parser {
    get atEnd(): boolean {
        return this.stream.length === 0;
    }

    private isGarbage: boolean = false;

    private ignoreNext: boolean = false;

    constructor(private stream: string[]) {}

    getNextToken(): Token {
        const char = this.stream.shift();

        if (this.ignoreNext) {
            this.ignoreNext = false;
            return Token.NOTHING;
        }

        if (this.isGarbage) {
            if (char === ">") {
                this.isGarbage = false;
                return Token.GARBAGE_CLOSE;
            }

            if (char === "!") {
                this.ignoreNext = true;
                return Token.IGNORE;
            }

            return Token.GARBAGE;
        }

        switch (char) {
            case "{":
                return Token.GROUP_OPEN;
            case "}":
                return Token.GROUP_CLOSE;
            case "<":
                this.isGarbage = true;
                return Token.GARBAGE_OPEN;
            default:
                return Token.NOTHING;
        }
    }
}
