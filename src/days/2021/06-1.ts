import { mapToNumber } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    let fish = mapToNumber( input[0].split(','));

    for (let i = 0; i < 80; i++) {
        let add = [];

        for (let x = 0; x < fish.length; x++) {
            if (fish[x] === 0){
                fish[x] = 6;
                add.push(8)
            } else {
                fish[x]--;
            }
        }

        for (let a of add) {
            fish.push(a);
        }
    }

    return fish.length;
};