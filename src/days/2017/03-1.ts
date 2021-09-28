import { } from '@lib/input';
import { Vec2 } from '@lib/math';

export default function (input: string[]) {
    const target = Number(input[0]);

    let moveSeq = moveSequence();

    let position = new Vec2(0, 0);

    for (let i = 1; i < target; i++) {
        let move = moveSeq.next().value;

        position = position.add(move as Vec2);
    }

    return position.manhattan(new Vec2(0, 0));
};

function* moveSequence() {
    const queue = [
        new Vec2( 1,  0),
        new Vec2( 0, -1),
        new Vec2(-1,  0),
        new Vec2( 0,  1),
    ];

    let lengths = distanceSequence();

    let length = lengths.next().value;

    while (true) {
        queue.push(queue.shift());

        for (let i = 0; i < length; i++) {
            yield queue[queue.length-1];
        }

        length = lengths.next().value;
    }
}

function* distanceSequence(): Generator<number> {
    let second = false;
    let current = 1;

    while (true) {
        if (second) {
            second = false;
            yield current++;
        } else {
            second = true;
            yield current;
        }
    }
}
