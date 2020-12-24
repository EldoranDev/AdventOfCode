import IVec from './IVec';

export default class Vec3 {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
    ) {}

    public add(b: Vec3) {
        this.x += b.x;
        this.y += b.y;
        this.z += b.z;

        return this;
    }

    public sub(b: Vec3) {
        this.x -= b.x;
        this.y -= b.y;
        this.z -= b.z;

        return this;
    }

    public mult(a: number) {
        this.x *= a;
        this.y *= a;
        this.z *= a;

        return this;
    }

    public manhattan(b: Vec3): number {
        return Math.abs(this.x - b.x) + Math.abs(this.y - b.y);
    }

    public clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    public toString(): string {
        return `V3(${this.x}|${this.y}|${this.z})`;
    }

    public static add(a: Vec3, b: Vec3) {
        return a.clone().add(b);
    }

    public static sub(a: Vec3, b: Vec3) {
        return a.clone().sub(b);
    }

    public static mult(a: Vec3, b: number) {
        return a.clone().mult(b);
    }
}