import provideInput from './provider/input';
import { system as logger } from './logger';

export async function get(args) {
    try {
        await provideInput(args.year, args.day);
        logger.info(`Added input for day ${args.day} of year ${args.year}`);
    } catch (e) {
        switch (e.code) {
            case 'ENOENT':
                logger.error('Missing session file');
                break;
            default:
                console.error(e);
        }
    }
}