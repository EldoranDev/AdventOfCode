import { } from '@lib/input';
import { Vec3 } from '@lib/math';
import { Convay } from '@lib/simulation';

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

    let convay = new Convay<Vec3>(
        (pos) => [
            new Vec3(-1, +1, 0),
            new Vec3(+1, -1, 0),
            new Vec3(-1, 0, +1),
            new Vec3(0, -1, +1),
            new Vec3(0, +1, -1),
            new Vec3(+1, 0, -1)
        ].map((offset) => Vec3.add(pos, offset)),
        (neighbors) => neighbors > 0 && neighbors <= 2,
        (neighbors) => neighbors === 2
    );
    
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

        convay.set(position, !convay.getStateOfField(position));
    }

    for (let round = 0; round < 100; round++) {
        convay.tick();
    }

    let count = 0;

    for (let entry of convay.getState().values()) {
        if (entry[1]) {
            count++;
        }
    }

    return count;
};