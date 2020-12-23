import { } from '@lib/input';

export default function (input: string[]) {
    let cups = input[0].split('').map(c => Number(c));

    let orderdCups = [...cups].sort((a, b) => a - b);

    let currentIndex = 0;

    for (let i = 0; i < 100; i++) {

        let current = cups[currentIndex];
        let destination = current-1;
        let destinationIndex = -1;

        console.log(`-- move ${i+1} --`);
        console.log(`current: ${current}`);
        console.log(`cups: ${cups}`);

        let outside = cups.splice(currentIndex+1, 3);

        if (currentIndex+4 >= cups.length) {
            outside.push(...cups.splice(0, 3 - outside.length));
        }
        
        console.log(`Pickup ${outside}`);
        

        while (destinationIndex === -1) {
            destinationIndex = cups.indexOf(destination);
            
            if (destinationIndex === -1) {
                destination--;

                if (destination < orderdCups[0]) {
                    destination = orderdCups[orderdCups.length-1];
                }
            } 
        }
        
        console.log(`destination: ${destination}`);


        cups.splice(destinationIndex+1, 0, ...outside);
        
        currentIndex = (cups.indexOf(current) + 1) % cups.length;

        console.log();
    }

    let index = cups.indexOf(1);

    let order = '';

    console.log(cups);
    for (let i = 1; i < cups.length; i++) {
        let ind = (index+i) % cups.length;
        order += cups[ind].toString();
    }

    return order;
};