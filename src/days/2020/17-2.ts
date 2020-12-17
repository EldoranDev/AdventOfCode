import { } from '@lib/input';
import { Vec4 } from '@lib/math';
import { notDeepEqual } from 'assert';

const ROUNDS = 6;
type Map = boolean[][][][];

export default function (input: string[]) {
    let world: Map = [];
    const SIZE = input.length+ROUNDS*2;
    
    for (let z = 0; z < SIZE; z++) {
        world[z] = [];
        for (let w = 0; w < SIZE; w++) {
            world[z][w] = [];
            for (let y = 0; y < SIZE; y++) {
                world[z][w][y] = [];
                for (let x = 0; x < SIZE; x++) {
                    world[z][w][y][x] = false;
                }
            }
        }
    }

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input.length; x++) {
            world[ROUNDS][ROUNDS][y+ROUNDS][x+ROUNDS] = input[y].charAt(x) === '#'
        }
    }
    
    let neighbors = [];

    for (let z = -1; z <= 1; z++) {
        for (let w = -1; w <= 1; w++) {
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if (!(z === w && w === y && y === x && x === 0)) {
                        neighbors.push(new Vec4(x, y, z, w));
                    }
                }
            }
        }
    }

    let cubes = 0;

    for (let r = 0; r < ROUNDS; r++) {
        const tmp: Map = [];
        cubes = 0;

        for (let z = 0; z < SIZE; z++) {
            tmp[z] = [];
            for (let w = 0; w < SIZE; w++) {
                tmp[z][w] = [];
                for (let y = 0; y < SIZE; y++) {
                    tmp[z][w][y] = [];
                    for (let x = 0; x < SIZE; x++) {
                        let pos = new Vec4(x, y, z, w);

                        let alive = 0;

                        for (let n of neighbors) {
                            let np = Vec4.add(pos, n);

                            if (world[np.z] && world[np.z][np.w] && world[np.z][np.w][np.y] && world[np.z][np.w][np.y][np.x]) {
                                alive++;
                            }
                        }

                        if (world[z][w][y][x]) {
                            tmp[z][w][y][x] = alive === 3 || alive === 2;
                        } else {
                            tmp[z][w][y][x] = alive === 3;
                        }

                        if (tmp[z][w][y][x]) {
                            cubes++;
                        }
                    }
                }
            }
        }

        world = tmp;
    }

    return cubes;
};

function print(world: Map): void {
    for (let z = 0; z < world.length; z++) {
        console.log(`z=${z}`);
        
        for (let y = 0; y < world[z].length; y++) {
            for (let x = 0; x < world[z][y].length; x++) {
                process.stdout.write(world[z][y][x] ? '#' : '.');
            }

            process.stdout.write('\n');
        }
    }
}