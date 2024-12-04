/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
const CACHE: Map<symbol, Map<string, any>> = new Map();

export function memoize<K extends Function>(fn: K): K {
    const FN_CACHE_KEY = Symbol('CACHE_KEY');
    CACHE.set(FN_CACHE_KEY, new Map());

    return <any> function (...args) {
        const CACHE_KEY = args.reduce((prev, cur) => prev + JSON.stringify(cur), '');

        const cache = CACHE.get(FN_CACHE_KEY);

        if (cache.has(CACHE_KEY)) {
            return cache.get(CACHE_KEY);
        }

        const result = fn(...args);

        cache.set(CACHE_KEY, result);

        return result;
    };
}
