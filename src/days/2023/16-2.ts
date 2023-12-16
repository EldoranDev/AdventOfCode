/* eslint-disable max-len */
import { } from '@lib/input';
import { Context } from '@app/types';
import { Grid2D, create } from '@lib/array2d';
import { Vec2 } from '@lib/math';

type Tile = '.' | '/' | '\\' | '-' | '|';

interface Field {
    type: Tile;
    energy: number;
}

interface Beam {
    pos: Vec2;
    direction: Vec2;
}

export default function (input: string[], { logger }: Context) {
    const grid: Grid2D<Field> = create(input[0].length, input.length, null);

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            grid[y][x] = {
                type: input[y][x] as Field['type'],
                energy: 0,
            };
        }
    }

    let max = 0;

    for (let y = 0; y < grid.length; y++) {
        max = Math.max(
            max,
            energize(grid, new Vec2(-1, y), new Vec2(1, 0)),
            energize(grid, new Vec2(grid[y].length, y), new Vec2(-1, 0)),
        );
    }

    for (let x = 0; x < grid[0].length; x++) {
        max = Math.max(
            max,
            energize(grid, new Vec2(x, -1), new Vec2(0, 1)),
            energize(grid, new Vec2(x, grid.length), new Vec2(0, -1)),
        );
    }

    return max;
}

function energize(grid: Grid2D<Field>, pos: Vec2, direction: Vec2): number {
    const energy = new Map<string, Array<Vec2>>();

    let beams: Array<Beam> = [
        {
            pos: pos.clone(),
            direction: direction.clone(),
        },
    ];

    while (beams.length > 0) {
        const newBeams: Array<Beam> = [];

        for (const beam of beams) {
            beam.pos.add(beam.direction);

            if (
                beam.pos.y < 0
                || beam.pos.y >= grid.length
                || beam.pos.x < 0
                || beam.pos.x >= grid[beam.pos.y].length
            ) {
                // Remove beam from list as we do not need to process it anymore
                continue;
            }

            if (!energy.has(beam.pos.toString())) {
                energy.set(beam.pos.toString(), []);
            }

            const b = energy.get(beam.pos.toString());

            if (b.findIndex((v) => v.equals(beam.direction)) !== -1) {
                continue;
            }

            b.push(beam.direction);

            newBeams.push(...getBeams(beam, grid[beam.pos.y][beam.pos.x].type));
        }

        beams = newBeams;
    }

    return energy.size;
}

function getBeams(beam: Beam, tile: Tile): Array<Beam> {
    switch (tile) {
        case '.':
            return [beam];
        case '|':
            if (beam.direction.x === 0) {
                return [beam];
            }

            return [
                {
                    pos: new Vec2(beam.pos.x, beam.pos.y),
                    direction: new Vec2(0, 1),
                },
                {
                    pos: new Vec2(beam.pos.x, beam.pos.y),
                    direction: new Vec2(0, -1),
                },
            ];
        case '-':
            if (beam.direction.y === 0) {
                return [beam];
            }

            return [
                {
                    pos: new Vec2(beam.pos.x, beam.pos.y),
                    direction: new Vec2(1, 0),
                },
                {
                    pos: new Vec2(beam.pos.x, beam.pos.y),
                    direction: new Vec2(-1, 0),
                },
            ];
        case '/':
            if (beam.direction.x !== 0) {
                return [
                    {
                        pos: new Vec2(beam.pos.x, beam.pos.y),
                        direction: new Vec2(0, -beam.direction.x),
                    },
                ];
            }

            return [
                {
                    pos: new Vec2(beam.pos.x, beam.pos.y),
                    direction: new Vec2(-beam.direction.y, 0),
                },
            ];
        case '\\':
            if (beam.direction.x !== 0) {
                return [
                    {
                        pos: new Vec2(beam.pos.x, beam.pos.y),
                        direction: new Vec2(0, beam.direction.x),
                    },
                ];
            }

            return [
                {
                    pos: new Vec2(beam.pos.x, beam.pos.y),
                    direction: new Vec2(beam.direction.y, 0),
                },
            ];
        default:
            throw new Error(`Unknown tile ${tile}`);
    }
}
