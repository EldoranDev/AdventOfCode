import { } from '@lib/input';

export default function (input: string[]) {
    let grid: string[][] = input.map((line) => line.split(''));

    let hadChange = true;
    let tick = 0;
    do {
        let newGrid: string[][] = JSON.parse(JSON.stringify(grid));
        hadChange = false;

        for (let x = 0; x < newGrid.length; x++) {
            for (let y = 0; y < newGrid[x].length; y++) {
                if (grid[x][y] === '.') continue;

                if (grid[x][y] === 'L') {
                    if (occupiedAdjacent(grid, x, y) === 0) {
                        hadChange = true;
                        newGrid[x][y] = '#';
                    }
                }

                if (grid[x][y] === '#') {
                    if (occupiedAdjacent(grid, x, y) >= 4) {
                        newGrid[x][y] = 'L';
                        hadChange = true;
                    }
                }
            }
        }
        grid = newGrid;
        tick++;

    } while (hadChange);

    return grid.reduce((sum, line) => sum + line.reduce((s, seat) => seat === '#' ? s + 1: s, 0), 0);
};

function printBoard(grid: string[][]): void {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            process.stdout.write(grid[x][y]);
        }
        process.stdout.write('\n');
    }
}

function occupiedAdjacent(grid: string[][], x: number, y: number): number {
    let count = 0;

    if (
        grid[x+1] && grid[x+1][y] === '#'
    ) {
        count++;
    }

    if(grid[x+1] && grid[x+1][y+1] === '#') {
        count++;
    }
    if(grid[x+1] && grid[x+1][y-1] === '#') {
        count++;
    }
    if(grid[x] && grid[x][y+1] === '#') {
        count++;
    }
    if(grid[x] && grid[x][y-1] === '#') {
        count++;
    }
    if(grid[x-1] && grid[x-1][y] === '#') {
        count++;
    }
    if(grid[x-1] && grid[x-1][y+1] === '#') {
        count++;
    }
    if(grid[x-1] && grid[x-1][y-1] === '#') {
        count++;
    }

    return count;
}