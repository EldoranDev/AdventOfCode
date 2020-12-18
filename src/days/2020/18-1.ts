import { } from '@lib/input';

type TokenType = 'Number'|'Operator'|'GROUP_OPEN'|'GROUP_CLOSE';
type Token = { value?: string|number, type: TokenType};

export default function (input: string[]) {
    let sum = 0;

    for (let i = 0; i < input.length; i++) {
        sum += calculate(input[i]);
    }

    return sum;
};

function calculate(expr: string): number {
    let tokens: Array<Token> = [];

    let currNumm = '';

    for (let i = 0; i < expr.length; i++) {
        let c = expr.charAt(i);
        
        switch (c) {
        case '(':
            if (currNumm !== '') {
                console.log(currNumm);
                tokens.push({ value: Number(currNumm), type: 'Number' });
                currNumm = '';
            }
            tokens.push({ type: 'GROUP_OPEN' })
            break;
        case ')':
            if (currNumm !== '') {
                tokens.push({ value: Number(currNumm), type: 'Number' });
                currNumm = '';
            }

            tokens.push({type: 'GROUP_CLOSE'});
            break;
        case '*':
        case '+':
            tokens.push({ value: c,  type: 'Operator'});
            break;
        case ' ':
            if (currNumm !== '') {
                tokens.push({ value: Number(currNumm), type: 'Number' });
                currNumm = '';
            }
            break;
        default:
            currNumm += c;
        }
    }

    if (currNumm.length > 0) {
        tokens.push({ value: Number(currNumm), type: 'Number' });
    }

    const output: Token[] = [];
    const operator: Token[] = [];

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        switch (token.type) {
            case 'Number':
                output.push(token);
                break;
            case 'GROUP_OPEN':
                operator.push(token)
                break;
            case 'GROUP_CLOSE':
                while (operator[operator.length-1].type !== 'GROUP_OPEN') {
                    output.push(operator.pop());
                }

                operator.pop();
                break;
            case 'Operator':
                while (operator.length > 0 && operator[operator.length-1].type !== 'GROUP_OPEN') {
                    output.push(operator.pop());
                }

                operator.push(token);
                break;
        }
    }

    while (operator.length > 0) {
        output.push(operator.pop());
    }
    
    return solveRPN(output);
}

function solveRPN (tokens: Token[]): number {
    let stack: number[] = [];

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        if (token.type === 'Number'){
            stack.push(token.value as number);
        } else if (token.type === 'Operator') {
            if (token.value === '+') {
                stack.push(stack.pop() + stack.pop());
            }
            if (token.value === '*') {
                stack.push(stack.pop() * stack.pop());
            }
        }
    }

    return stack[0];
}