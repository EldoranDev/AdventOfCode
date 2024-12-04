import { describe, it, expect } from "vitest";
import Vec2 from "./vec2";

describe("Vec2", () => {
    it("should init as Zero", () => {
        const v = new Vec2();

        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it("should add component wise", () => {
        const a = new Vec2(1, 2);
        const b = new Vec2(3, 4);

        const res = Vec2.add(a, b);

        expect(res.x).toBe(4);
        expect(res.y).toBe(6);
    });

    it("should scale vector correclty", () => {
        const a = new Vec2(2, 0);

        a.setLength(1);

        expect(a.length).toBe(1);
        expect(a.x).toBe(1);
    });

    it("should give the correct length", () => {
        const a = new Vec2(4, 3);

        expect(a.length).toBe(5);
    });

    it("should give the correct squared length", () => {
        const a = new Vec2(2, 3);

        expect(a.lengthSquared).toBe(13);
    });

    it("should subtract component wise", () => {
        const a = new Vec2(1, 2);
        const b = new Vec2(3, 5);

        const res = Vec2.sub(a, b);

        expect(res.x).toBe(-2);
        expect(res.y).toBe(-3);
    });

    it("should be equal if components are the same", () => {
        const a = new Vec2(1, 2);
        const b = new Vec2(1, 2);

        expect(a.equals(b)).toBe(true);
    });

    it("should not be equal if components are differnt", () => {
        const a = new Vec2(1, 2);
        const b = new Vec2(1, 3);

        expect(a.equals(b)).toBe(false);
    });

    it("should scale correctly", () => {
        const a = new Vec2(1, 2);

        a.mult(2);

        expect(a.x).toBe(2);
        expect(a.y).toBe(4);
    });

    it("should be converted to string correctly", () => {
        const a = new Vec2(2, 4);

        expect(a.toString()).toBe("V2(2|4)");
    });

    it("should scale correctly without changing original when static", () => {
        const a = new Vec2(2, 4);

        const result = Vec2.mult(a, 2);

        expect(a.x).toBe(2);
        expect(a.y).toBe(4);

        expect(result.x).toBe(4);
        expect(result.y).toBe(8);
    });
});
