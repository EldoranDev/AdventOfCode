import { } from '@lib/input';
import { Context } from '@app/types';
import { unique } from '@lib/array';

export default function (input: string[], { logger }: Context) {
    const MARKER_LENGTH = 14;
    const buffer = input[0];
    const marker = buffer.substring(0, MARKER_LENGTH).split('');

    for (let i = MARKER_LENGTH; i < buffer.length; i++) {
        marker.shift();
        marker.push(buffer[i]);

        if (marker.length === unique(marker).length) {
            return i + 1;
        }
    }

    return 'Nothing Found';
}
