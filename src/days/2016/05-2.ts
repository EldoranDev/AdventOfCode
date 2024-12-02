import { } from '@lib/input';
import { Context } from '@app/types';
import { createHash } from 'crypto';

export default function (input: string[], { logger }: Context) {
    const roomId = input[0];
    let id = 0;
    
    const password = [];

    let found = 0;

    while(found < 8) {
        const md5 = createHash('md5');
        const current = md5.update(`${roomId}${id}`).digest('hex').toString();
        
        if (current.startsWith('00000')) {
            logger.debug(`Found at ${id} -> ${current} -> ${current.charAt(5)}`);

            if(isNaN(parseInt(current.charAt(5), 10))) {
                id++;
                continue;
            }

            const position = Number(current.charAt(5));
            
            if (position > 7) {
                id++;
                continue;
            }

            if (password[position] == undefined) {
                password[position] = current.charAt(6);
                found++;
            }

            logger.debug(password);
        }

        id++;
    }

    return password.join('');
};