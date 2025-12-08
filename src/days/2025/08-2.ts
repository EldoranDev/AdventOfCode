import {} from "@lib/input";
import { Context } from "@app/types";
import { Vec3 } from "@lib/math";

interface connection {
    dist: number;
    a: box;
    b: box;
}

interface box {
    vec: Vec3;
    circuit: box[];
}

export default function (input: string[], { logger }: Context) {
    let circuits: Array<box[]> = [];

    const boxes = input.map((l): box => {
        const [x, y, z] = l.split(",").map(Number);
        const box: box = {
            vec: new Vec3(x, y, z),
            circuit: [],
        };

        circuits.push([box]);
        box.circuit = circuits[circuits.length - 1];

        return box;
    });

    const connections: Array<connection> = [];

    for (let i = 0; i < boxes.length; i++) {
        for (let j = i; j < boxes.length; j++) {
            if (i == j) continue;

            connections.push({
                dist: boxes[i].vec.distanceSquared(boxes[j].vec),
                a: boxes[i],
                b: boxes[j],
            });
        }
    }

    connections.sort((a, b) => a.dist - b.dist);

    let last: connection = connections[0];

    for (let i = 0; circuits.length > 1; i++) {
        if (connections[i].a.circuit == connections[i].b.circuit) continue;

        last = connections[i];

        connections[i].a.circuit.push(...connections[i].b.circuit);

        const b = connections[i].b.circuit.splice(0, connections[i].b.circuit.length);

        for (const box of b) {
            box.circuit = connections[i].a.circuit;
        }

        circuits = circuits.filter((c) => c.length > 0);
    }

    return last.a.vec.x * last.b.vec.x;
}
