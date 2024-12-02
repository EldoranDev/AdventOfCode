import { } from '@lib/input';
import { Context } from '@app/types';

type ConnectionMap = Map<string, Set<string>>;

const paths: string[][] = [];

const START = 'start';
const END = 'end';

const connections: ConnectionMap = new Map();

export default function (input: string[], { logger }: Context) {
    for (const line of input) {
        const [a, b] = line.split('-');

        if (!connections.has(a)) {
            connections.set(a, new Set<string>());
        }

        if (!connections.has(b)) {
            connections.set(b, new Set<string>());
        }

        connections.get(a).add(b);
        connections.get(b).add(a);
    }
    
    findEnd(
        START,
        []
    );

    return paths.length;

};

function isLowerCase(str: string): boolean {
    return str.toLocaleLowerCase() === str;
}

function findEnd(
    current: string,
    path: string[]
): void {
    if (current === END) {
        paths.push(path);
        return;
    }

    path.push(current);

    const cons = connections.get(current);
    

    for (const con of cons) {
        if (con === START) continue;

        if (isLowerCase(con)) {
            if (path.filter(c => c === con).length > 1) continue;
        
            let hasDouble = false;    
            for (const node of path.filter(c => isLowerCase(c))) {
                if (path.filter(c => c === node).length > 1) {
                    hasDouble = true;
                    break;
                }
            }

            if (hasDouble && path.includes(con)) {
                continue;
            }
        }
        
        findEnd(con, [...path]);
    }
}


