export function sum (...values: number[]): number {
    return values.reduce((prev, cur) => prev + cur, 0);    
}