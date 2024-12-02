import { getLineGroups } from '@lib/input';

export default function (input: string[]) {

    const groups = getLineGroups(input);

    const players: number[][] = [
        groups[0].slice(1).map(n => Number(n)),
        groups[1].slice(1).map(n => Number(n)),
    ]


    const winner = combat(players);
    
    let sum = 0;

    for (let i = 0; i < players[winner].length; i++) {
        sum += (players[winner].length - i) * players[winner][i];    
    }

    return sum;
};

function combat(players: number[][], game: number = 1): number {
    const rounds: Set<string>[] = [
        new Set(),
        new Set(),
    ];
    let round = 1;

    while (players[0].length > 0 && players[1].length > 0) {
        const p1Turn = JSON.stringify(players[0]);
        const p2Turn = JSON.stringify(players[1]);

        if (rounds[0].has(p1Turn)) { return 0; }
        if (rounds[1].has(p2Turn)) { return 0; }

        rounds[0].add(p1Turn);
        rounds[1].add(p2Turn);

        const p1 = players [0].shift();
        const p2 = players[1].shift();

        let winner = -1;

        if (players[0].length >= p1 && players[1].length >= p2) {
            winner = combat([
                players[0].slice(0, p1),
                players[1].slice(0, p2),
            ], ++game);
        } else {
            winner = p1 > p2 ? 0 : 1;
        }

        if (winner === 0) {
            
            players[0].push(p1);
            players[0].push(p2);
        } else {
            players[1].push(p2);
            players[1].push(p1);
        }

        round++;
    }

    return (players[0].length > players[1].length) ? 0 : 1;
}