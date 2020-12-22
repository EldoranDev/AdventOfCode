import { getLineGroups } from '@lib/input';

export default function (input: string[]) {

    const groups = getLineGroups(input);

    const players: number[][] = [
        groups[0].slice(1).map(n => Number(n)),
        groups[1].slice(1).map(n => Number(n)),
    ]

    
    while (players[0].length > 0 && players[1].length > 0) {
        let p1 = players[0].shift();
        let p2 = players[1].shift();

        if (p1 > p2) {
            players[0].push(p1);
            players[0].push(p2);
        } else {
            players[1].push(p2);
            players[1].push(p1);
        }
    }
    
    players.sort((a, b) => b.length - a.length);

    let sum = 0;

    for (let i = 0; i < players[0].length; i++) {
        sum += (players[0].length - i) * players[0][i];    
    }

    return sum;
};