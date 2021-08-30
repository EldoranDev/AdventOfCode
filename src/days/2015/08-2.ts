import { } from '@lib/input';

export default function (input: string[]) {
    let length = 0;

    for (let line of input) {
        var a = '';
        let escape = addEscape(line);
        eval(`a = ${line}`);

        length += escape.length - line.length;
    }

    return length;
};

function addEscape(line: string): string {
    line = line.split('\\').join('\\\\');
    line = line.split('\\\\"').join('\\\\\\"');
    
    return `"\\"${line.substr(1, line.length-2)}\\""`;
}