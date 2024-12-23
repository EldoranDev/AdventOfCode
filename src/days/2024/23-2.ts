import {} from "@lib/input";
import { Context } from "@app/types";

export default function (input: string[], { logger }: Context) {
    const networks: Array<string[]> = [];

    const pcs = new Map<string, string[]>();

    for (const line of input) {
        const [a, b] = line.split("-");

        if (!pcs.has(a)) {
            pcs.set(a, []);
        }

        if (!pcs.has(b)) {
            pcs.set(b, []);
        }

        pcs.get(a).push(b);
        pcs.get(b).push(a);
    }

    const closed = new Set<string>();

    for (const [n0, nn0] of pcs.entries()) {
        for (const n1 of nn0) {
            const nn1 = pcs.get(n1);

            for (const n2 of nn1) {
                const nn2 = pcs.get(n2);

                if (nn2.includes(n0)) {
                    const network = [n0, n1, n2].sort();

                    if (closed.has(network.join(""))) {
                        continue;
                    }

                    closed.add(network.join(""));

                    networks.push(network);
                }
            }
        }
    }
    let updated = true;

    while (updated) {
        updated = false;

        for (const network of networks) {
            for (const [pc, n] of pcs) {
                if (contains(n, network)) {
                    updated = true;
                    network.push(pc);
                    network.sort();
                }
            }
        }
    }

    networks.sort((a, b) => b.length - a.length);

    return networks[0].join(",");
}

function contains<T>(a: T[], b: T[]): boolean {
    for (const bb of b) {
        if (!a.includes(bb)) {
            return false;
        }
    }

    return true;
}
