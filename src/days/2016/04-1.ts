import { } from '@lib/input';
import { Context } from '@app/types';

const extractor = /([a-z\-]+)(\d+)\[([a-z]+)\]/;

type Room = { name: string, sector: number, checksum: string};

export default function (input: string[], { logger }: Context) {
    const rooms: Array<Room> = [];

    for (let line of input) {
        const chars = {};

        let match = extractor.exec(line);
        let room: Room = {
            name: match[1].replaceAll('-', ''),
            sector: Number(match[2]),
            checksum: match[3],
        };

        logger.debug(JSON.stringify(room));

        rooms.push(room);
    }

    return rooms.filter((room: Room) => {
        let chars: { [key: string]: number } = {};
        let order: { [key: string]: string[] } = {};

        for (let char of room.name.split('')) {
            if (!chars[char]) {
                chars[char] = 0;
            }

            chars[char]++;
        }

        const letters = Object.keys(chars);
        
        for (let letter of letters) {
            if (!order[chars[letter]]) {
                order[chars[letter]] = [];
            }

            order[chars[letter]].push(letter);
        }
        const hashsum = [];

        const counts = Object.keys(order).map((o) => Number(o)).sort((a, b) => b - a);

        for (let count of counts) {
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