export default function unique<T>(array: T[]): T[] {
    return [...(new Set<T>(array)).values()];
}
