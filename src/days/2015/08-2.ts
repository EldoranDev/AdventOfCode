import {} from "@lib/input";

export default function (input: string[]) {
    let length = 0;

    for (const line of input) {
        try {
            const a = getString(line);

            console.log(a);

            length += a.length - line.length;
        } catch (e) {
            console.log(e);
            console.log(line);
        }
    }
    return length;
}

function getString(db: string): string {
    let res = "";

    for (let i = 0; i < db.length; ) {
        const current = getToken(db, i);

        i += current.length;

        res += escape(current);
    }

    return `"${res}"`;
}

function escape(token: string): string {
    if (token === '"') {
        return `\\"`;
    }

    if (token.length > 0 && token[1] === '"') {
        return '\\\\\\"';
    }

    return token.replaceAll("\\", "\\\\");
}

const LITS = ['"', "'", "\\"];

function getToken(str: string, position: number): string {
    if (str[position] === "\\") {
        if (LITS.includes(str[position + 1])) {
            return str.substring(position, position + 2);
        }

        if (str[position + 1] === "x") {
            return str.substring(position, position + 4);
        }

        throw new Error("Invalid Escape");
    }

    return str[position];
}
