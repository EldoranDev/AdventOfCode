import { } from '@lib/input';

export default function (input: string[]) {
    const parsed = JSON.parse(input.join('\r\n'));

    return getSum(parsed);
};

function getSum(objects: Object|any[], sum: number = 0): number {
    let ignore = false;
    let object = false;

    if (!Array.isArray(objects)) {
        objects = Object.values(objects);
        object = true;
    }
    
    let add = 0;

    for (let element of objects as any[]) {
        if (Number.isInteger(element)) {
            add += element;
        }
                
        if (typeof element === 'string') {
            if (element === 'red' && object) {
                ignore = true;
            }
            continue;
        }
    
        add += getSum(element);
    }
            
    if (ignore) {
        return sum;
    }

    return sum + add;
}