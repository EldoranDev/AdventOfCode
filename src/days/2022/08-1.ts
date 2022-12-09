import { } from '@lib/input';
import { Context } from '@app/types';
import { create, getColumn } from '@lib/array2d';

const LEFT = 0b0001;
const RIGHT = 0b0010;
const TOP = 0b0100;
const BOT = 0b1000;

export default function (input: string[], { logger }: Context) {
    const grid = create<number>(input[0].length, input.length);
    const visibility = create<number>(input[0].length, input.length, 0);

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            grid[y][x] = Number(input[y][x]);
        }
    }

    let count = 0;

    for (let x = 0; x < grid[0].length; x++) {
        visibility[0][x] = LEFT;
        visibility[grid.length - 1][x] = RIGHT;

        count += 2;
    }

    for (let y = 1; y < grid.length - 1; y++) {
        visibility[y][0] = TOP;
        visibility[y][grid[y].length - 1] = BOT;

        count += 2;
    }

    for (let y = 1; y < grid.length - 1; y++) {
        const row = grid[y];
        let vis = getVisibles(row);

        for (const i of vis) {
            if (!visibility[y][i]) {
                visibility[y][i] = LEFT;
                count++;
            }
        }

        vis = getVisibles([...row].reverse());

        for (const i of vis) {
            const x = grid[y].length - 1 - i;

            if (!visibility[y][x]) {
                visibility[y][x] |= RIGHT;
                count++;
            }
        }
    }

    for (let x = 1; x < grid[0].length - 1; x++) {
        const row = getColumn(grid, x);
        let vis = getVisibles(row);

        for (const i of vis) {
            if (!visibility[i][x]) {
                visibility[i][x] |= TOP;
                count++;
            }
        }

        vis = getVisibles(row.reverse());

        for (const i of vis) {
            const y = grid.length - 1 - i;

            if (!visibility[y][x]) {
                visibility[y][x] |= BOT;
                count++;
            }
        }
    }

    return count;
}

/**
 * Returns the indexes of the visible trees in that row
 *
 * @param row Row to analyze
 */
function getVisibles(row: number[]): number[] {
    const visible: number[] = [];

    let highest = row[0];

    for (let i = 0; i < row.length - 1; i++) {
        if (highest === 9) {
            break;
        }

        if (row[i] > highest) {
            highest = row[i];
            visible.push(i);
        }
    }

    return visible;
}
