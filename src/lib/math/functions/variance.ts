import { sum } from "./sum";

export function variance(...values: number[]): number {
    const avg = sum(...values) / values.length;

    return sum(...values.map((num) => (num - avg) * (num - avg))) / values.length;
}
