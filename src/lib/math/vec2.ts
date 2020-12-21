export default class Vec2 {
    constructor(
        public x: number = 0,
        public y: number = 0
    ) {}

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

    public mult(a: number) {
        this.x *= a;
        this.y *= a;

        return this;
    }

    public equals(b: Vec2): boolean {
        return this.x === b.x && this.y === b.y;
    }

    public rotate(rotation: number, mode: 'rad'|'deg' = 'deg') {
        let rads = rotation;

        if (mode === 'deg') {
            rads *= Math.PI/180;
        }

        let newX =  Math.cos(rads) * this.x - Math.sin(rads) * this.y;
        let newY =  Math.sin(rads) * this.x + Math.cos(rads) * this.y;
        
        this.x = Math.round(newX*1000)/1000;
        this.y = Math.round(newY*1000)/1000;

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

    public static sub(a: Vec2, b: Vec2) {
        return a.clone().sub(b);
    }

    public static mult(a: Vec2, b: number) {
        return a.clone().mult(b);
    }

    public static rotate(a: Vec2, rotation: number, mode: 'rad'|'deg' = 'deg') {
        return a.clone().rotate(rotation, mode);
    }

    public static UP = new Vec2(0, 1);
    public static LEFT = new Vec2(-1, 0);
    public static RIGHT = new Vec2(1, 0);
    public static DOWN = new Vec2(0, -1);
    public static ZERO = new Vec2();
}