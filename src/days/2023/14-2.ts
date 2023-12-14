/* eslint-disable no-param-reassign */
import { } from '@lib/input';
import { Context } from '@app/types';
import { Grid2D, create } from '@lib/array2d';
import { stdout } from 'process';

// const CYCLES = 1_000_000_000;

const CYCLES = 1_000;

export default function (input: string[], { logger }: Context) {
    const grid = create(input[0].length, input.length, '.');

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            grid[y][x] = input[y][x];
        }
    }

    const configs = new Map<string, number>();

    for (let i = 0; i < CYCLES; i++) {
        tiltNorth(grid);
        tiltWest(grid);
        tiltSouth(grid);
        tiltEast(grid);

        const config = getConfig(grid);

        if (configs.has(config)) {
            return configs.get(config);
        }

        configs.set(config, getScore(grid));
    }

    return configs.get(getConfig(grid));
}

function tiltNorth(grid: Grid2D<string>): void {
    for (let y = 1; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== 'O') {
                continue;
            }

            let yy = y;

            do {
                yy--;
            } while (yy > 0 && grid[yy][x] === '.');

            if (grid[yy][x] !== '.') {
                yy++;
            }

            grid[y][x] = '.';
            grid[yy][x] = 'O';
        }
    }
}

function tiltWest(grid: Grid2D<string>): void {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 1; x < grid[y].length; x++) {
            if (grid[y][x] !== 'O') {
                continue;
            }

            let xx = x;

            do {
                xx--;
            } while (xx > 0 && grid[y][xx] === '.');

            if (grid[y][xx] !== '.') {
                xx++;
            }

            grid[y][x] = '.';
            grid[y][xx] = 'O';
        }
    }
}

function tiltSouth(grid: Grid2D<string>): void {
    for (let y = grid.length - 2; y >= 0; y--) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== 'O') {
                continue;
            }

            let yy = y;

            do {
                yy++;
            } while (yy < grid.length - 1 && grid[yy][x] === '.');

            if (grid[yy][x] !== '.') {
                yy--;
            }

            grid[y][x] = '.';
            grid[yy][x] = 'O';
        }
    }
}

function tiltEast(grid: Grid2D<string>): void {
    for (let y = 0; y < grid.length; y++) {
        for (let x = grid[y].length - 2; x >= 0; x--) {
            if (grid[y][x] !== 'O') {
                continue;
            }

            let xx = x;

            do {
                xx++;
            } while (xx < grid[y].length - 1 && grid[y][xx] === '.');

            if (grid[y][xx] !== '.') {
                xx--;
            }

            grid[y][x] = '.';
            grid[y][xx] = 'O';
        }
    }
}

function getConfig(grid: Grid2D<string>): string {
    const config = Array.from({ length: grid.length }, () => 0);

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            config[y] <<= 1;
            config[y] |= grid[y][x] === 'O' ? 1 : 0;
        }
    }

    return config.join('-');
}

function getScore(grid: Grid2D<string>): number {
    let sum = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== 'O') {
                continue;
            }

            sum += (grid.length - y);
        }
    }

    return sum;
}

function print(grid: Grid2D<string>): void {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            stdout.write(grid[y][x]);
        }
        stdout.write('\n');
    }
}
