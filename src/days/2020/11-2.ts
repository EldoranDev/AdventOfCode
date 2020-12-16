import { } from '@lib/input';

type Vec2 = { x: number, y: number };

const DIRECTIONS: Vec2[] = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
]

export default function (input: string[]) {
    let grid: string[][] = input.map((line) => line.split(''));

    let hadChange = false;

    do {
        let newGrid: string[][] = JSON.parse(JSON.stringify(grid));
        hadChange = false;

        for (let y = 0; y < newGrid.length; y++) {
            for (let x = 0; x < newGrid[y].length; x++) {
                if (grid[y][x] === '.') continue;

                if (grid[y][x] === 'L') {
                    if (!canSeeAny(grid, {x, y})) {
                        hadChange = true;
                        newGrid[y][x] = '#';
                    }
                }

                if (grid[y][x] === '#') {
                    if (occupiedAdjacent(grid,{x, y}) >= 5) {
                        newGrid[y][x] = 'L';
                        hadChange = true;
                    }
                }
            }
        }
        grid = newGrid;
    } while (hadChange);

    return grid.reduce((sum, line) => sum + line.reduce((s, seat) => seat === '#' ? s + 1: s, 0), 0);
};

function printBoard(grid: string[][], highlight: Vec2 = {x: -1, y: -1}): void {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (x == highlight.x && y == highlight.y) {
                process.stdout.write('O');
            } else {
                process.stdout.write(grid[y][x]);
            }
        }
        process.stdout.write('\n');
    }

    
}

function canSeeAny(grid: string[][], pos: Vec2): boolean {
    for (let dir of DIRECTIONS) {
        if (checkDirection(grid, pos, dir) === '#') {
            return true;
        }
    }

    return false;
}
function checkDirection(grid: string[][], pos: Vec2, direction: Vec2): string|null {
    let x = pos.x + direction.x;
    let y = pos.y + direction.y;

    while (x >= 0 && y >= 0 && y < grid.length && x < grid[y].length) {
        if (grid[y][x] !== '.') {
            return grid[y][x];
        }

        x += direction.x;
        y += direction.y;
    }
    
    
    return '';
}

function occupiedAdjacent(grid: string[][], pos: Vec2): number {
    let count = 0;

    for (let dir of DIRECTIONS) {
        if (checkDirection(grid, pos, dir) === '#') {
            count++;
        }
    }

    return count;
}