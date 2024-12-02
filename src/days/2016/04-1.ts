import { } from '@lib/input';
import { Context } from '@app/types';

const extractor = /([a-z\-]+)(\d+)\[([a-z]+)\]/;

type Room = { name: string, sector: number, checksum: string};

export default function (input: string[], { logger }: Context) {
    const rooms: Array<Room> = [];

    for (const line of input) {
        const chars = {};

        const match = extractor.exec(line);
        const room: Room = {
            name: match[1].replaceAll('-', ''),
            sector: Number(match[2]),
            checksum: match[3],
        };

        logger.debug(JSON.stringify(room));

        rooms.push(room);
    }

    return rooms.filter((room: Room) => {
        const chars: { [key: string]: number } = {};
        const order: { [key: string]: string[] } = {};

        for (const char of room.name.split('')) {
            if (!chars[char]) {
                chars[char] = 0;
            }

            chars[char]++;
        }

        const letters = Object.keys(chars);
        
        for (const letter of letters) {
            if (!order[chars[letter]]) {
                order[chars[letter]] = [];
            }

            order[chars[letter]].push(letter);
        }
        const hashsum = [];

        const counts = Object.keys(order).map((o) => Number(o)).sort((a, b) => b - a);

        for (const count of counts) {
            order[count].sort()
            hashsum.push(
                ...order[count]
            );
        }

        const hash = hashsum.join('').substr(0, room.checksum.length);

        logger.debug(`${hash} === ${room.checksum}`);

        return hash === room.checksum;
    }).reduce((prev: number, room: Room) => {
        return prev + room.sector;
    }, 0)
};