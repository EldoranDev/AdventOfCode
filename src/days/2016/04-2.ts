import { } from '@lib/input';
import { Context } from '@app/types';
import { string } from 'yargs';

const extractor = /([a-z\-]+)(\d+)\[([a-z]+)\]/;

type Room = { name: string, sector: number, checksum: string};

export default function (input: string[], { logger }: Context) {
    let rooms: Array<Room> = [];

    for (let line of input) {
        const chars = {};

        let match = extractor.exec(line);
        let room: Room = {
            name: match[1],
            sector: Number(match[2]),
            checksum: match[3],
        };

        logger.debug(JSON.stringify(room));

        rooms.push(room);
    }

    rooms = rooms.filter((room: Room) => {
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
            if (letter == '-') continue;

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

        return hash === room.checksum;
    });

    for (let room of rooms) {
        let name = decrypt(room.name, room.sector);
        logger.debug(`${room.name} -> ${name}`);

        room.name = name;

        logger.debug(JSON.stringify(room));
    }

    rooms = rooms.filter((room) => {
        return room.name.includes('north');
    });

    return rooms[0].sector;
};

function decrypt(input: string, lenght: number): string {
    const charCodes: number[] = [];

    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);

        if (charCode === 45) {
            charCode = 32;
        } else {
            charCode = (((charCode - 97) + lenght) % (26)) + 97;
        }

        charCodes.push(charCode);
    }

    return String.fromCharCode(...charCodes);
}