export type Tuple<T> = [T, T];

export function* pairs<T>(input: T[]): Generator<Tuple<T>> {
    for (let i = 0; i < input.length - 1; i++) {
        for (let j = i; j < input.length - 1; j++) {
            yield [input[i], input[j + 1]];
        }
    }
}
