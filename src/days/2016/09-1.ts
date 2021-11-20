import { } from '@lib/input';
import { Context } from '@app/types';

const DETECTOR = /\((\d+)x(\d+)\)/;

export default function (input: string[], { logger }: Context) {
    let message = input[0];
    let output = "";

    let match: RegExpMatchArray;

    match = message.match(DETECTOR);

    do {
        let index = message.indexOf(match[0]);
        let repeat = message.substr(index + match[0].length, Number(match[1]));

        logger.debug(`Need to repeat ${repeat} ${match[2]} times`);
                
        let replace = "";

        for (let i = 0; i < Number(match[2]); i++) {
            replace += repeat;
        }

        let add = message.slice(0, index);
        message = message.substr(add.length, message.length - add.length);

        output += add + replace;
        logger.debug(`Left: ${message}`);
        logger.debug(`Adding ${add}`);
        

        message = message.replace(message.substr(0, match[0].length + repeat.length), "");
        
        match = message.match(DETECTOR);
    } while (match !== null);
    output += message;

    logger.debug(output);

    return output.length;
};