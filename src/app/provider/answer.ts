import { system as logger } from '@app/logger';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { URLSearchParams } from 'url';

export default async (year: number, day: number, part: number, solution: string) => {
    logger.info('✉️  submitting to aoc');

    const session = readFileSync(
        resolve(__dirname, '..', '..', '..', '.session'),
    );

    const response = await fetch(`https://adventofcode.com/${year}/day/${day}/answer`, {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'max-age=0',
            'content-type': 'application/x-www-form-urlencoded',
            'upgrade-insecure-requests': '1',
            cookie: `session=${session.toString()}`,
            Referer: `https://adventofcode.com/${year}/day/${day}`,
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: new URLSearchParams({
            level: part.toString(),
            answer: solution,
        }),
        method: 'POST',
    });

    const body = await response.text();

    if (body.includes("That's not the right answer")) {
        logger.error('❌ This is not the correct response');
        return;
    }

    if (body.includes('You gave an answer too recently')) {
        logger.error('⏰ Answer submitted to recently');
        return;
    }

    if (body.includes("That's the right answer!")) {
        logger.info('✅ successfully submited solution');
        return;
    }

    logger.info(body);
};
