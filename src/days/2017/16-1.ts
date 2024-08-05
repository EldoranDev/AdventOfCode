/* eslint-disable no-case-declarations */
import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger, test }: Context) {
    const group = test ? 'abcde'.split('') : 'abcdefghijklmnop'.split('');

    for (const action of input[0].split(',')) {
        switch (action[0]) {
            case 's':
                const [, count] = /s(.+)/.exec(action);

                for (let i = 0; i < Number(count); i++) {
                    group.unshift(group.pop());
                }

                break;
            case 'x':
                const [, x1, x2] = /x(.+)\/(.+)/.exec(action);

                const tmpX = group[x1];
                group[x1] = group[x2];
                group[x2] = tmpX;

                break;
            case 'p':
                const [, p1, p2] = /p(.+)\/(.+)/.exec(action);

                const ip1 = group.indexOf(p1);
                const ip2 = group.indexOf(p2);

                const tmpP = group[ip1];
                group[ip1] = group[ip2];
                group[ip2] = tmpP;

                break;
            default:
                throw new Error('Invalid dance move');
        }
    }

    return group.join('');
}
