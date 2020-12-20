import { getLineGroups } from '@lib/input';
import { timeLog } from 'console';

type Tile = { id: number, data: boolean[][] , borders: string[] };

export default function (input: string[]) {
    const ip = getLineGroups(input);

    const tiles: Tile[] = [];

    for (let t of ip) {
        let id = Number(t[0].replace(':', '').split(' ')[1]);
        let data = [];

        for (let y = 1; y < t.length; y++) {
            data[y-1] = new Array(t[y].length);
            for (let x = 0; x < t[y].length; x++) {
                data[y-1][x] = t[y].charAt(x) === '#';
            }
        }

        let borders = getBorders(data);

        tiles.push({id, data, borders });
    }

    const corners: number[] = tiles.filter((t) => findNeighbors(t, tiles).length === 2).map(t => t.id);

    return corners.reduce((c, v) => c*v, 1);
};

function getBorders(data: boolean[][]): string[] {
    let borders: string[] = [];

    borders.push(JSON.stringify([...data[0]]));
    borders.push(JSON.stringify([...data[0]].reverse()));
    borders.push(JSON.stringify([...data[data.length-1]]))
    borders.push(JSON.stringify([...data[data.length-1]].reverse()))

    let l = [];
    let r = [];

    for (let y = 0; y < data.length; y++) {
        l[y] = data[y][0];
        r[y] = data[y][data[y].length-1];
    }

    borders.push(JSON.stringify(l), JSON.stringify(r));
    borders.push(JSON.stringify(l.reverse()), JSON.stringify(r.reverse()));

    return borders;
}

function print(tile: Tile): void {
    console.log(`Tile ${tile.id}: `);

    for (let y = 0; y < tile.data.length; y++) {
        for (let x = 0; x < tile.data[y].length; x++) {
            process.stdout.write(tile.data[y][x] ? '#' : '.');
        }
        process.stdout.write('\n');
    }
}

function findNeighbors(tile: Tile, tiles: Tile[]): Tile[] {
    const neighbors: Tile[] = [];

    for (let t of tiles) {
        if (t.id === tile.id) continue;

        if (areAdjacent(tile, t)) {
            neighbors.push(t);
        }
    }    
    
    return neighbors;
}

function areAdjacent(a: Tile, b: Tile): boolean {
    for (let ab of a.borders) {
        for (let bb of b.borders) {
            if (ab === bb) {
                return true;
            }
        }
    }

    return false;
}
