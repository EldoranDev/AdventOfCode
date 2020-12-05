export default function (input: string[]) {
  let highest = 0;
  
  for (const pass of input) {
    let upper = 127;
    let lower = 0;

    let row = 0;
    let column = 0;

    for (let i = 0; i < 7; i++) {
        let direction = pass.charAt(i);
        
        let diff = ((upper - lower )/2) | 0;
        diff++;
        
        if (direction === 'F') {
            upper -= diff;
        }

        if (direction === 'B') {
            lower += diff;
        }
    }

    row = lower;

    upper = 7;
    lower = 0;

    for (let i = 0; i < 3; i++) {
        let direction = pass.charAt(7+i);
        
        let diff = ((upper - lower )/2) | 0;
        diff++;
        
        if (direction === 'L') {
           upper -= diff;
        }

        if (direction === 'R') {
            lower += diff;
        }
    }

    column = lower;

    let id = row * 8 + column;
    console.log(row, column, id);
    if (id > highest) {
        highest = id;
    }
  }

  return highest;
};