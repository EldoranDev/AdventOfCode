import { } from '@lib/input';

export default function (input: string[]) {
    let length = 0;

    for (const line of input) {
        try {
            const a = getString(line);
    
            length += line.length - a.length;
        } catch (e) {
            console.log(e);
            console.log(line);
        }
    }
    return length;
};

function getString(db: string): string {
    let res = '';

    for (let i = 0; i < db.length;)  {
        const current = getToken(db, i);
        
        i += current.length;

        res += toString(current);
    }

    return res;
}

function toString(token: string): string {
    if (token === '"') {
        return '';
    }

    if (token.substring(0, 2) === '\\x') {
        return String.fromCharCode(Number(token.substring(2)));
    }

    if (token[0] === '\\') {
        return token[1];
    }

    return token;
}

const LITS = ['"', '\'', '\\'];

function getToken(str: string, position: number): string {
    if (str[position] === '\\') {
        if (LITS.includes(str[position + 1])) {
            return str.substring(position, position + 2);
        }

        if (str[position + 1] === 'x') {
            return str.substring(position, position + 4);
        }

        throw new Error('Invalid Escape');
    }

    return str[position];
}