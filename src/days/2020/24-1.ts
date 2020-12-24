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

    const DIM = 50;
    const OFFSET = (DIM/2)|0

    let map: boolean[][][] = new Array(DIM);

    for (let x = 0; x < DIM; x++) {
        map[x] = new Array(DIM);
        for (let y = 0; y < DIM; y++) {
            map[x][y] = new Array(DIM);
            for (let z = 0; z < DIM; z++) {
                map[x][y][z] = false;
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

        console.log(`Flipping ${position} from ${map[position.x+OFFSET][position.y+OFFSET][position.z+OFFSET]} to ${!map[position.x+OFFSET][position.y+OFFSET][position.z+OFFSET]}`)
        map[position.x + OFFSET][position.y+OFFSET][position.z+OFFSET] = !map[position.x+OFFSET][position.y+OFFSET][position.z+OFFSET];
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