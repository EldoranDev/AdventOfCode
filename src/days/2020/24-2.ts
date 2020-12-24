import { } from '@lib/input';
import { Vec3 } from '@lib/math';

export default function (input: string[]) {

    let instructions: string[][] = [];

    for (let line of input) {
        let tile: string[] = [];
        let inst: string[] = line.split('');
        let current = '';

        for (let i = 0; i < inst.length; i++) {
            current += inst[i];

            if (current.includes('e') || current.includes('w')) {
                tile.push(current);
                current = '';
            }
        }

        instructions.push(tile);
    }

    const DIM = 140;
    const OFFSET = (DIM/2)|0

    let map: boolean[][][] = new Array(DIM);
    let nmap: boolean[][][] = new Array(DIM);

    for (let x = 0; x < DIM; x++) {
        map[x] = new Array(DIM);
        nmap[x] = new Array(DIM);
        for (let y = 0; y < DIM; y++) {
            map[x][y] = new Array(DIM);
            nmap[x][y] = new Array(DIM);
            for (let z = 0; z < DIM; z++) {
                map[x][y][z] = false;
                nmap[x][y][z] = false;
            }
        }
    }
    
    for (let tile of instructions) {
        let position: Vec3 = new Vec3(0, 0, 0);

        for (let move of tile) {

            switch(move) {
                case 'w':
                    position.add(new Vec3(-1, +1, 0));
                    break;
                case 'e':
                    position.add(new Vec3(+1, -1, 0));
                    break;
                case 'sw':
                    position.add(new Vec3(-1, 0, +1));
                    break;
                case 'se':
                    position.add(new Vec3(0, -1, +1));
                    break;
                case 'nw':
                    position.add(new Vec3(0, +1, -1));
                    break;
                case 'ne':
                    position.add(new Vec3(+1, 0, -1));
                    break;
            }    
        }

        map[position.x + OFFSET][position.y+OFFSET][position.z+OFFSET] = !map[position.x+OFFSET][position.y+OFFSET][position.z+OFFSET];
    }
    let tmpMap: boolean[][][];

    for (let round = 0; round < 100; round++) {
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map.length; y++) {
                for (let z= 0; z < map.length; z++) {
                    let nbs = getNeighbors(new Vec3(x, y, z), map);
                    let bc = nbs.filter((c) => c).length;

                    if (map[x][y][z]) {
                        if (bc === 0 || bc > 2) {
                            nmap[x][y][z] = false;
                        } else {
                            nmap[x][y][z] = map[x][y][z];
                        }
                    } else {
                        if (bc === 2) {
                            nmap[x][y][z] = true;
                        } else  {
                            nmap[x][y][z] = map[x][y][z];
                        }
                    }
                }
            }
        }

        tmpMap = map;
        map = nmap;
        nmap = tmpMap;

        let count = 0;

        for (let x = 0; x < DIM; x++) {
            for (let y = 0; y < DIM; y++) {
                for (let z = 0; z < DIM; z++) {
                    count += map[x][y][z] ? 1 : 0;
                }
            }
        }

        console.log(`Day ${round+1}: ${count}`)
    }

    let count = 0;

    for (let x = 0; x < DIM; x++) {
        for (let y = 0; y < DIM; y++) {
            for (let z = 0; z < DIM; z++) {
                count += map[x][y][z] ? 1 : 0;
            }
        }
    }

    return count;
};

function getNeighbors(pos: Vec3, map: boolean[][][]): boolean[] {
    let neighbors = [];
    let np = [
        new Vec3(-1, +1, 0),
        new Vec3(+1, -1, 0),
        new Vec3(-1, 0, +1),
        new Vec3(0, -1, +1),
        new Vec3(0, +1, -1),
        new Vec3(+1, 0, -1)
    ];

    for (let n of np) {
        let p = Vec3.add(pos, n);

        if (map[p.x] === undefined || map[p.x][p.y] === undefined || map[p.x][p.y][p.z] === undefined) continue;

        neighbors.push(map[p.x][p.y][p.z]);
    }

    return neighbors;
}