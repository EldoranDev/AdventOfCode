export default function (input: string[]) {
  let highest = 0;
  
  for (const pass of input) {
    const row = binarySearch(pass.substr(0, 7), 0, 127, { lower: 'F', upper: 'B' });
    const column = binarySearch(pass.substr(7), 0, 7, { lower: 'L', upper: 'R' });   

    const id = row * 8 + column;
    
    if (id > highest) {
        highest = id;
    }
  }

  return highest;
};

type searchSettings = { lower: string, upper: string };

function binarySearch(input: string, _lower: number, _upper: number, settings: searchSettings): number {
    let upper = _upper;
    let lower = _lower;

    for (let i = 0; i < input.length; i++) {
        const direction = input.charAt(i);
        
        let diff = ((upper - lower )/2) | 0;
        diff++;
        
        if (direction === settings.lower) {
           upper -= diff;
        }

        if (direction === settings.upper) {
            lower += diff;
        }
    }

    return lower;
}