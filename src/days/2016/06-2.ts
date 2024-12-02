import { } from '@lib/input';
import { Context } from '@app/types';

export default function (input: string[], { logger }: Context) {
    const columns = [];

    for (let i = 0; i < input[0].length; i++) {
        columns[i] = {};
    }

    for (const line of input) {
        for (let i = 0; i < line.length; i++) {
            if (columns[i][line[i]] == undefined) {
                columns[i][line[i]] = 0;
            }

            columns[i][line[i]]++;
        }
    }

    let output = "";

    for (let i = 0; i < columns.length; i++) {
        let highestLetter = null;
        let highestCount = 999;

        const column = columns[i];
        const letters = Object.keys(column);

        for (const letter of letters) {
            if (column[letter] < highestCount) {
                highestCount = column[letter];
                highestLetter = letter;
            }
        }

        output += highestLetter;
    }

    return output;
};