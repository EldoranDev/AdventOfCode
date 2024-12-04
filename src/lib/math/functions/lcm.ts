import { GCD } from "./gcd";

/**
 * Generate the least common multiple of two numbers.
 *
 * Uses GCD to calculate LCM.
 */
export function LCM(a: number, b: number): number {
    return Math.abs(a * b) / GCD(a, b);
}
