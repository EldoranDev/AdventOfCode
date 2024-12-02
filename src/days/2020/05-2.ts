export default function (input: string[]) {
    const ids = [];

    for (const pass of input) {
        const row = binarySearch(pass.substr(0, 7), 0, 127, { lower: 'F', upper: 'B' });
        const column = binarySearch(pass.substr(7), 0, 7, { lower: 'L', upper: 'R' });   

        ids.push(row * 8 + column);
    }

    ids.sort((a, b) => a - b);

    for (let i = 0; i <= ids.length; i++) {
        if (ids[i] !== i + ids[0]) {
            return i + ids[0];
        }
    }
  
    return ids[0];
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