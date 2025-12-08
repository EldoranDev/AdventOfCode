import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec3 } from "@lib/math";

interface connection {
    dist: number;
    a: number;
    b: number;
}

export default function (input: string[], { logger }: Context) {
    let minX = Infinity,
        minY = Infinity,
        minZ = Infinity;
    let maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity;

    const boxes = input.map((l): Vec3 => {
        const [x, y, z] = l.split(",").map(Number);

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;

        return new Vec3(x, y, z);
    });

    const cellSize = Math.cbrt(((maxX - minX) * (maxY - minY) * (maxZ - minZ)) / input.length);

    const grid = new Map<string, number[]>();

    const hash = (x: number, y: number, z: number) => `${x},${y},${z}`;

    for (let i = 0; i < input.length; i++) {
        const b = boxes[i];
        const cx = Math.floor((b.x - minX) / cellSize);
        const cy = Math.floor((b.y - minY) / cellSize);
        const cz = Math.floor((b.z - minZ) / cellSize);

        const key = hash(cx, cy, cz);
        if (!grid.has(key)) grid.set(key, []);

        grid.get(key).push(i);
    }

    const neighbors = [-1, 0, 1];

    const connections: Array<connection> = [];

    for (let i = 0; i < boxes.length; i++) {
        const a = boxes[i];

        const cx = Math.floor((a.x - minX) / cellSize);
        const cy = Math.floor((a.y - minY) / cellSize);
        const cz = Math.floor((a.z - minZ) / cellSize);

        for (const dx of neighbors) {
            for (const dy of neighbors) {
                for (const dz of neighbors) {
                    const list = grid.get(hash(cx + dx, cy + dy, cz + dz));
                    if (!list) continue;

                    for (const j of list) {
                        if (i === j) continue;

                        const b = boxes[j];
                        connections.push({
                            dist: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2,
                            a: i,
                            b: j,
                        });
                    }
                }
            }
        }
    }

    connections.sort((a, b) => a.dist - b.dist);

    const parent = new Array(boxes.length).fill(0).map((_, i) => i);
    const size = new Array(boxes.length).fill(1);

    const find = (x: number): number => {
        while (parent[x] !== x) x = parent[x] = parent[parent[x]];
        return x;
    };

    const union = (a: number, b: number): boolean => {
        a = find(a);
        b = find(b);

        if (a === b) return false;

        if (size[a] < size[b]) [a, b] = [b, a];

        parent[b] = a;
        size[a] += size[b];

        return true;
    };

    let remaining = boxes.length;
    let idx = 0;

    while (remaining > 1) {
        const c = connections[idx++];
        if (union(c.a, c.b)) remaining--;
    }

    const a = boxes[connections[idx - 1].a];
    const b = boxes[connections[idx - 1].b];

    return a.x * b.x;
}
