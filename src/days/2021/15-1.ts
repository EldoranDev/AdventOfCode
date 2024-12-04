import { Context } from "@app/types";
import { create } from "@lib/array2d";
import { Vec2 } from "@lib/math";
import { MinHeap } from "@lib/collections";
import { Logger } from "winston";

class Node {
    public constructor(
        public pos: Vec2,
        public risk: number,
        public previous: Node = null,
        public routeScore: number = Number.MAX_SAFE_INTEGER,
    ) {}

    public get id(): string {
        return this.pos.toString();
    }

    public get h(): number {
        return;
    }

    public equals(node: Node): boolean {
        return node.id === this.id;
    }
}

const NEXT = [new Vec2(1, 0), new Vec2(-1, 0), new Vec2(0, 1), new Vec2(0, -1)];

export default function (input: string[], { logger }: Context) {
    const map = create<Node>(input[0].length, input.length, null);

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x] = new Node(new Vec2(x, y), Number(input[y].charAt(x)));
        }
    }

    const FROM = map[0][0];
    const TO = map[map.length - 1][map[0].length - 1];

    FROM.routeScore = FROM.risk;

    const open = new MinHeap<Node>();

    open.push(FROM, 0);

    while (open.length > 0) {
        const node = open.shift();

        if (node.equals(TO)) {
            break;
        }

        NEXT.map((v: Vec2) => {
            const d = Vec2.add(v, node.pos);

            return map[d.y] ? map[d.y][d.x] : null;
        })
            .filter((v) => v != undefined)
            .forEach((n) => {
                const cost = node.routeScore + n.risk;

                if (cost < n.routeScore) {
                    n.previous = node;
                    n.routeScore = cost;

                    open.push(n, cost + n.pos.manhattan(TO.pos));
                }
            });
    }

    const path: Node[] = [];
    let current = TO;

    while (current != null) {
        path.push(current);
        current = current.previous;
    }

    return path.reduce((c, n) => c + n.risk, 0) - FROM.risk;
}

function print(map: Node[][], path: Node[], logger: Logger): void {
    let output = "\n";
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            output += map[y][x].risk;
        }
        output += "\n";
    }

    logger.debug(output);
}
