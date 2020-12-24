import { IVec} from "@lib/math";

type MapKey = string;
type Neighbordetection<T> = (pos: T) => T[];
type Rule = (activeNeighbors: number) => boolean;
type ConvayMap<T> = Map<MapKey, [T, boolean]>;

export default class Convay<T extends IVec> {
    private map: ConvayMap<T> = new Map();

    public constructor(
        private neighbors: Neighbordetection<T>,
        private activeRule: Rule,
        private inactiveRule: Rule,
    ) {}

    public set(coordinate: T, value: boolean): void
    {
        this.map.set(coordinate.toString(), [coordinate, value]);

        this.addNeighbors(coordinate);
    }

    public tick() {
        let nap: ConvayMap<T> = new Map();
                
        for (let entry of this.map.entries()) {
            const neighbors = this.getNeighborsValues(this.neighbors(entry[1][0]));
            const activeNeighbors = neighbors.filter(n => n).length;

             if (entry[1][1]) {
                nap.set(entry[0], [entry[1][0], this.activeRule(activeNeighbors)]);        

                this.addNeighbors(entry[1][0]);
            } else {
                nap.set(entry[0],[entry[1][0], this.inactiveRule(activeNeighbors)]);
            }
        }

        this.map = nap;
    }
    
    public getState(): ConvayMap<T> {
        return this.map;
    }

    public getActiveCount(): number {
        let count = 0;

        for (let entry of this.map.values()) {
            if (entry[1]) {
                count++;
            }
        }

        return count;
    }

    public getStateOfField(coordinate: T): boolean {
        const key = coordinate.toString();

        if (this.map.has(key)) {
            return this.map.get(key)[1];
        }

        return false;
    }

    private addNeighbors(coordinate: T): void {
        for (let neighbor of this.neighbors(coordinate)) {
            const key: MapKey = neighbor.toString();

            if (this.map.has(key)) continue;

            this.map.set(key, [neighbor, false]);
        }
    }

    private getNeighborsValues(coords: T[]): boolean[] {
        return coords.map((coord) => {
            if (this.map.has(coord.toString())) {
                return this.map.get(coord.toString())[1];
            }

            return false;
        });
    }
}

