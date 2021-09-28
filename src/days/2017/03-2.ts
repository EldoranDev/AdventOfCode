import { create } from '@lib/array2d';
import { } from '@lib/input';
import { Vec2 } from '@lib/math';

export default function (input: string[]) {
    const target = Number(input[0]);

    const storage = create<number>(1_000, 1_000);
    const pos = new Vec2(500, 500);

    const moveSeq = moveSequence();

    let lastNumber = 1;

    storage[pos.y][pos.x] = 1;

    while (lastNumber < target) {
        let move = moveSeq.next().value as Vec2;

        pos.add(move);

        lastNumber = storage[pos.y][pos.x] = getSum(storage, pos.x, pos.y);
    }


    return lastNumber;
};

function getSum(array: number[][], x: number, y: number): number {
    let sum = 0;

    for (let pos of round()) {
        sum += array[y + pos.y][x + pos.x] ?? 0;
    }

    return sum;
}

function* round() {
    const queue = [
        new Vec2( 1,  0),
        new Vec2( 1,  -1),
        new Vec2( 0,  -1),
        new Vec2( -1,  -1),
        new Vec2( -1,  0),
        new Vec2( -1,  1),
        new Vec2( 0,  1),
        new Vec2( 1,  1),
    ];

    while (queue.length > 0) {
        yield queue.shift();
    }
}

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

