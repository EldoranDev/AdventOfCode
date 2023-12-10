import IVec from './IVec';

export default class Vec2 implements IVec {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) {}

    get length(): number {
        return Math.sqrt(this.lengthSquared);
    }

    get lengthSquared(): number {
        return this.x ** 2 + this.y ** 2;
    }

    public setLength(length: number): Vec2 {
        this.mult(length / this.length);

        return this;
    }

    public add(b: Vec2) {
        this.x += b.x;
        this.y += b.y;

        return this;
    }

    public sub(b: Vec2) {
        this.x -= b.x;
        this.y -= b.y;

        return this;
    }

    public dot(b: Vec2): number {
        return this.x * b.x + this.y * b.y;
    }

    public mult(a: number) {
        this.x *= a;
        this.y *= a;

        return this;
    }

    public equals(b: Vec2): boolean {
        return this.x === b.x && this.y === b.y;
    }

    public toString(): string {
        return `V2(${this.x}|${this.y})`;
    }

    public rotate(rotation: number, mode: 'rad' | 'deg' = 'deg') {
        let rads = rotation;

        if (mode === 'deg') {
            rads *= Math.PI / 180;
        }

        const newX = Math.cos(rads) * this.x - Math.sin(rads) * this.y;
        const newY = Math.sin(rads) * this.x + Math.cos(rads) * this.y;

        this.x = Math.round(newX * 1000) / 1000;
        this.y = Math.round(newY * 1000) / 1000;

        return this;
    }

    public manhattan(b: Vec2): number {
        return Math.abs(this.x - b.x) + Math.abs(this.y - b.y);
    }

    public clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    public static add(a: Vec2, b: Vec2) {
        return a.clone().add(b);
    }

    public static dot(a: Vec2, b: Vec2) {
        return a.dot(b);
    }

    public static sub(a: Vec2, b: Vec2) {
        return a.clone().sub(b);
    }

    public static mult(a: Vec2, b: number) {
        return a.clone().mult(b);
    }

    public static angleBetween(a: Vec2, b: Vec2): number {
        return Math.acos(a.dot(b) / (a.length * b.length));
    }

    public static rotate(a: Vec2, rotation: number, mode: 'rad' | 'deg' = 'deg') {
        return a.clone().rotate(rotation, mode);
    }

    public static UP = new Vec2(0, 1);

    public static LEFT = new Vec2(-1, 0);

    public static RIGHT = new Vec2(1, 0);

    public static DOWN = new Vec2(0, -1);

    public static ZERO = new Vec2();

    public static ULRD = [
        this.UP, this.LEFT, this.RIGHT, this.DOWN,
    ];
}
