import { getLineGroups } from '@lib/input';
import { Vec2 } from '@lib/math';
import { flipHorizontal, flipVertical, getColumn } from '@lib/array2d';
import { equals } from '@lib/array';

type Tile = { id: number, data: boolean[][] , borders: boolean[][], neighbors: Tile[] };
type Monster = { height: number, width: number, offsets: Vec2[] };

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

        tiles.push({id, data, borders, neighbors: [] });
    }

    for (let t of tiles) {
        t.neighbors = findNeighbors(t, tiles);
    }

    const corners: Tile[] = tiles.filter(t => t.neighbors.length === 2);

    let grid: Tile[][] = [[]];

    grid[0][0] = corners[0];

    alignInitialCorner(grid);

    const pending: Vec2[] = [ new Vec2(0, 0) ];

    while(pending.length > 0) {
        let current = pending.shift();
        let tile = grid[current.y][current.x];
        
        // Check if we need to place something on the right
        // if checking border peace this will pass but we'll not find a tile to place
        // so it doesn't matter
        if (grid[current.y][current.x + 1] === undefined) {
            const rborder = getColumn(tile.data, tile.data.length-1);

            // Get the one that fits on the right side of the current tile
            // so has a matching border to our border on the right side
            // we can trust that we are aligned correctly as all alignes are based on initial corner
            let right = getMatching(rborder, tile.neighbors);

            // If a tile is found the current one isn't a corner peace so the found one can be placed
            if (right !== null) {
                alignLeft(rborder, right);

                grid[current.y][current.x + 1] = right;

                pending.push(new Vec2(current.x + 1, current.y));
            }
        }

        if (grid[current.y + 1] === undefined || grid[current.y + 1][current.x] === undefined) {
            const bborder = tile.data[tile.data.length-1];

            // Get the one that fits on the bottom side of the current tile
            // so has a matching border to our border on the bottom side of the current tile
            // we can trust that we are aligned correctly as all alignes are based on initial corner
            let bottom = getMatching(bborder, tile.neighbors);

            if (bottom !== null) {
                alignTop(bborder, bottom);

                if (grid[current.y+1] === undefined) {
                    grid[current.y+1] = [];
                }

                grid[current.y+1][current.x] = bottom;

                pending.push(new Vec2(current.x, current.y+1));
            }
        }
    }

    let image = createImage(grid);
    const monster = getMonster();


    const monsterCount = getMonsterCount(image, monster);
    
    const count = image.map(r => r.reduce((c, cc) => cc ? c+1 : c, 0)).reduce((c, r) => c + r, 0);

    return count - monsterCount * monster.offsets.length;
};

function getMonsterCount(image: boolean[][], monster: Monster): number {
    let count = 0;

    for (let i = 0; i < 4; i++) {
        count = countMonsters(image, monster);
        
        if (count !== 0) {
            return count;
        }

        image = rotateCW(image);
    }

    image = flipHorizontal(image);

    for (let i = 0; i < 4; i++) {
        count = countMonsters(image, monster);
        
        if (count !== 0) {
            return count;
        }

        image = rotateCW(image);
    }
}

function countMonsters (image: boolean[][], monster: Monster): number {
    let count = 0;

    for (let y = 0; y < image.length; y++) {
        
        if (y + monster.height >= image.length) {
            break;
        };

        for (let x = 0; x < image[y].length; x++) {
            if (x + monster.width >= image[y].length) {
                break;
            };
            
            let found = true;
            for (let offset of monster.offsets) {
                if (!image[y+offset.y][x+offset.x]) {
                    found = false;
                    break;
                }
            }

            if (found) {
                count++
            }
        }
    }

    return count;
}

function createImage(grid: Tile[][]): boolean[][] {
    const image: boolean[][] = [];

    let imgY = 0;
    let imgX = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const tile = grid[y][x];

            for (let yy = 1; yy < tile.data.length-1; yy++) {
                if (image[imgY + yy - 1] === undefined) {
                    image[imgY + yy - 1] = [];
                }
                for (let xx = 1; xx < tile.data[yy].length-1; xx++) {
                    image[imgY + yy - 1][imgX + xx - 1] = tile.data[yy][xx];
                }
            }

            imgX += tile.data[0].length - 2;
        }
        imgY += grid[0][0].data.length - 2;
        imgX = 0;
    }

    return image;
}

function getMonster(): Monster {
    const offsets: Vec2[] = [];

    const monster = [
        "                  # ",
        "#    ##    ##    ###",
        " #  #  #  #  #  #   ",
    ];

    for  (let y = 0; y < monster.length; y++) {
        for (let x = 0; x < monster[y].length; x++) {
            if (monster[y].charAt(x) === '#') {
                offsets.push(new Vec2(x, y));
            }
        }
    }

    return {
        height: monster.length,
        width: monster[0].length,
        offsets,
    };
}

function alignLeft(border: boolean[], tile: Tile) {
    let rb = [...border].reverse();

    while (
        !equals(border, getColumn(tile.data, 0))
        && !equals(rb, getColumn(tile.data, 0))
    ) {
        tile.data = rotateCW(tile.data);
    }

    if (!equals(border, getColumn(tile.data, 0))) {
        tile.data = flipVertical(tile.data);
    }
}

function alignTop(border: boolean[], tile: Tile) {
    let rb = [...border].reverse();

    while (
        !equals(border, tile.data[0])
        && !equals(rb, tile.data[0])
    ) {
        tile.data = rotateCW(tile.data);
    }

    if (!equals(border, tile.data[0])) {
        tile.data = flipHorizontal(tile.data);
    }
}

function alignInitialCorner(grid: Tile[][]) {
    let right = findMatching(grid[0][0].borders, grid[0][0].neighbors[0].borders);
    let bottom = findMatching(grid[0][0].borders, grid[0][0].neighbors[1].borders);

    let c = grid[0][0];

    while (
        !equals(c.data[c.data.length-1], bottom)
        && !equals(c.data[c.data.length-1], bottom.reverse())
    ) {
        c.data = rotateCW(c.data);
    }

    if (
        !equals(getColumn(c.data, c.data.length-1), right)
        && !equals(getColumn(c.data, c.data.length-1), right.reverse())
    ) {
        c.data = flipHorizontal(c.data);
    }
}

function getMatching(border: boolean[], tiles: Tile[]): Tile|null {
    for (let tile of tiles) {
        if (tile.borders.filter((b) => equals(border, b) || equals(border, b.reverse())).length > 0) {
            return tile;
        }
    }

    return null;
}

function rotateCW(mat: boolean[][]): boolean[][] {
    const M = mat.length;
    const N = mat[0].length;

    const nd: boolean[][] = [];

    for (let r = 0; r < M; r++) {
        for (let c = 0; c < N; c++) {
            if (nd[c] === undefined) {
                nd[c] = [];
            }

            nd[c][M-1-r] = mat[r][c];
        }
    }

    return nd;
}

function getBorders(data: boolean[][]): boolean[][] {
    let borders: boolean[][] = [];

    borders.push([...data[0]])
    borders.push([...data[data.length-1]]);

    let l = [];
    let r = [];

    for (let y = 0; y < data.length; y++) {
        l[y] = data[y][0];
        r[y] = data[y][data[y].length-1];
    }

    borders.push(l, r);

    return borders;
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

function findMatching(a: boolean[][], b: boolean[][]): boolean[]|null {
    for (let ab of a) {
        for (let bb of b) {
            if (
                equals(ab, bb)
                || equals(ab, bb.reverse())
                || equals(ab.reverse(), bb)
            ) {
                return ab
            }
        }
    }

    return null;
}

function areAdjacent(a: Tile, b: Tile): boolean {
    return findMatching(a.borders, b.borders) !== null;
}
