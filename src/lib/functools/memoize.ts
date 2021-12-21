const CACHE: Map<Symbol, Map<string, any>> = new Map();

export function memoize<K extends Function>(fn: K): K {
    const FN_CACHE_KEY = Symbol();
    CACHE.set(FN_CACHE_KEY, new Map());

    return <any>function (...args){
        const CACHE_KEY = args.reduce((prev, cur) => prev + JSON.stringify(cur), "");
        
        const cache = CACHE.get(FN_CACHE_KEY);

        if (cache.has(CACHE_KEY)) {
            return cache.get(CACHE_KEY); 
        }

        let result = fn(...args);

        cache.set(CACHE_KEY, result);

        return result;
    }
}