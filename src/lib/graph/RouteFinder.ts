export interface RouteFinder<K> {
    findRoute(from: K, to: K): K[];
}