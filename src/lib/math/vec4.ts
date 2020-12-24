import IVec from "./IVec";

export default class Vec4 implements IVec {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 0,
    ) {}

    public add(b: Vec4) {
        this.x += b.x;
        this.y += b.y;
        this.z += b.z;
        this.w += b.w;

        return this;
    }

    public sub(b: Vec4) {
        this.x -= b.x;
        this.y -= b.y;
        this.z -= b.z;
        this.w -= b.w;

        return this;
    }

    public mult(a: number) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
        this.w *= a;

        return this;
    }

    public manhattan(b: Vec4): number {
        return Math.abs(this.x - b.x) + Math.abs(this.y - b.y);
    }

    public clone(): Vec4 {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    public toString(): string {
        return `V4(${this.x}|${this.y}|${this.z}|${this.w})`;
    }

    public static add(a: Vec4, b: Vec4) {
        return a.clone().add(b);
    }

    public static sub(a: Vec4, b: Vec4) {
        return a.clone().sub(b);
    }

    public static mult(a: Vec4, b: number) {
        return a.clone().mult(b);
    }
}