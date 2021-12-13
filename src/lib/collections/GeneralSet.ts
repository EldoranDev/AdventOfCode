export class GeneralSet<T> {
    private map: Map<string, T> = new Map();

    public add(element: T) {
        this.map.set(element.toString(), element);
    }

    public values(): IterableIterator<T> {
        return this.map.values();
    }

    public has(element: T) {
        return this.map.has(element.toString());
    }

    public get size() {
        return this.map.size;
    }
    
    public forEach(cb: (x: T) => void): void {
        this.map.forEach((val) => {
            cb(val);
        });
    }
}