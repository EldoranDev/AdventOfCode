import { GCD } from './gcd';

export function LCM(a: number, b: number) : number {
    return Math.abs(a * b) / GCD(a, b);
}
