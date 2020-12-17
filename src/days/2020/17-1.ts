import { } from '@lib/input';
import { Vec3 } from '@lib/math';

const ROUNDS = 6;
type Map = boolean[][][];

export default function (input: string[]) {
    let world: Map = [];
    const SIZE = input.length+ROUNDS*2;
    
    for (let z = 0; z < SIZE; z++) {
        world[z] = [];
        for (let y = 0; y < SIZE; y++) {
            world[z][y] = [];
            for (let x = 0; x < SIZE; x++) {
                world[z][y][x] = false;
            }
        }
    }

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input.length; x++) {
            world[ROUNDS][y+ROUNDS][x+ROUNDS] = input[y].charAt(x) === '#'
        }
    }
    
    let neighbors = [];

    for (let z = -1; z <= 1; z++) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                if (!(z === y && y === x && x === 0)) {
                    neighbors.push(new Vec3(x, y, z));
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
            for (let y = 0; y < SIZE; y++) {
                tmp[z][y] = [];
                for (let x = 0; x < SIZE; x++) {
                    let pos = new Vec3(x, y, z);

                    let alive = 0;

                    for (let n of neighbors) {
                        let np = Vec3.add(pos, n);

                        if (world[np.z] && world[np.z][np.y] && world[np.z][np.y][np.x]) {
                            alive++;
                        }
                    }

                    if (world[z][y][x]) {
                        tmp[z][y][x] = alive === 3 || alive === 2;
                    } else {
                        tmp[z][y][x] = alive === 3;
                    }

                    if (tmp[z][y][x]) {
                        cubes++;
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