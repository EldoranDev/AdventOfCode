import { getLineGroups, mapToNumber } from '@lib/input';
import { Context } from '@app/types';
import { getColumn } from '@lib/array2d';

type field = { number: number, marked: boolean};

export default function (input: string[], { logger }: Context) {
    const bingoNumbers = mapToNumber(input[0].split(','));
  
    const boardsLines = getLineGroups(input.slice(2));

    const boards: Array<Array<{number: number, marked: boolean}>>[] = [];

    for (const bl of boardsLines) {
        const board = [];

        for (const line of bl) {
            board.push(mapToNumber(line.trim().split(' ').filter(e => e.trim() !== "")).map((n => ({ number: n, marked: false}))));
        }

        boards.push(board);
    }

    for (const number of bingoNumbers) {
        logger.debug(number);
        for (const board of boards) {
            
            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {
                    if (board[y][x].number === number) {
                        board[y][x].marked = true;
                        
                        logger.debug(board.reduce((prev, current) => {
                            return prev + "\n" + current.map(l => l.marked ? 'X' : 'O').join();
                        }, ""))

                        if (checkIfwon(board, x, y)) {
                            const unmarked = board.reduce((prev, cur) => {
                                return prev + cur.filter(e => !e.marked).reduce((p, c) => p + c.number, 0);
                            }, 0);

                            logger.debug(`We have ${unmarked} * ${number} as result`);
                            return unmarked * number;
                        }
                    }
                }
            }
        }

    }
};

function checkIfwon(board: field[][], x: number, y: number): boolean {
    
    const column = getColumn(board, x)

    if (column.filter(l => l.marked).length === column.length) {
        return true;
    }

    if (board[y].filter(l => l.marked).length === board[y].length) {
        return true;
    }

    return false;
}