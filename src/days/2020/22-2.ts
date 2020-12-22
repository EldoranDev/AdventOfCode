import { getLineGroups } from '@lib/input';
import { Console } from 'console';



export default function (input: string[]) {

    const groups = getLineGroups(input);

    const players: number[][] = [
        groups[0].slice(1).map(n => Number(n)),
        groups[1].slice(1).map(n => Number(n)),
    ]


    let winner = combat(players);
    
    console.log(winner);
    console.log(players[winner]);

    let sum = 0;

    for (let i = 0; i < players[winner].length; i++) {
        sum += (players[winner].length - i) * players[winner][i];    
    }

    return sum;
};

function combat(players: number[][], game: number = 1): number {
    const rounds: string[][] = [
        [],
        []
    ];
    let round = 1;

    while (players[0].length > 0 && players[1].length > 0) {
        let p1Turn = JSON.stringify(players[0]);
        let p2Turn = JSON.stringify(players[1]);

        if (rounds[0].includes(p1Turn)) { return 0; }
        if (rounds[1].includes(p2Turn)) { return 0; }

        // console.log(`-- Round ${round} (Game ${game}) --`);

        rounds[0].push(p1Turn);
        rounds[1].push(p2Turn);

        // console.log(`Player 1's deck: ${players[0]}`);
        // console.log(`Player 2's deck: ${players[1]}`);

        let p1 = players [0].shift();
        let p2 = players[1].shift();

        // console.log(`Player 1 plays: ${p1}`);
        // console.log(`Player 2 plays: ${p2}`);

        let winner = -1;

        if (players[0].length >= p1 && players[1].length >= p2) {
            winner = combat([
                players[0].slice(0, p1),
                players[1].slice(0, p2),
            ], ++game);
            // console.log(`Winner of game ${game} is playe ${winner+1}`);
        } else {
            winner = p1 > p2 ? 0 : 1;
        }

        // console.log(`Player ${winner+1} wins round ${round} of game ${game}`)

        if (winner === 0) {
            
            players[0].push(p1);
            players[0].push(p2);
        } else {
            players[1].push(p2);
            players[1].push(p1);
        }

        round++;
        //console.log();
    }

    return (players[0].length > players[1].length) ? 0 : 1;
}