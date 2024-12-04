import {} from "@lib/input";
import { Context as AppContext } from "@app/types";

import { Vec3 } from "@lib/math";

import { init } from "z3-solver";

interface Storm {
    position: Vec3;
    velocity: Vec3;
}

export default async function (input: string[], { logger }: AppContext) {
    const storms = input.map(parse);

    const { Context, em } = await init();

    const { Solver, Int } = Context("main");

    const X = Int.const("X");
    const Y = Int.const("Y");
    const Z = Int.const("Z");

    const VX = Int.const("VX");
    const VY = Int.const("VY");
    const VZ = Int.const("VZ");

    const solver = new Solver();

    for (let i = 0; i < 3; i++) {
        const t = Int.const(`t${i}`);

        const x = Int.val(storms[i].position.x);
        const vx = Int.val(storms[i].velocity.x);

        const y = Int.val(storms[i].position.y);
        const vy = Int.val(storms[i].velocity.y);

        const z = Int.val(storms[i].position.z);
        const vz = Int.val(storms[i].velocity.z);

        solver.add(
            t.gt(0),
            X.add(VX.mul(t)).eq(x.add(vx.mul(t))),
            Y.add(VY.mul(t)).eq(y.add(vy.mul(t))),
            Z.add(VZ.mul(t)).eq(z.add(vz.mul(t))),
        );
    }

    if ((await solver.check()) === "sat") {
        const model = solver.model();

        const [x, y, z] = [
            Number(model.eval(X).toString()),
            Number(model.eval(Y).toString()),
            Number(model.eval(Z).toString()),
        ];

        em.PThread.terminateAllThreads();
        return x + y + z;
    }

    em.PThread.terminateAllThreads();
    return undefined;
}

function parse(line: string): Storm {
    const [x, y, z, vx, vy, vz] = /(\d*),\s*(\d*),\s*(\d*)\s*@\s*(-?\d*),\s*(-?\d*),\s*(-?\d*)/
        .exec(line)
        .slice(1)
        .map(Number);
    return {
        position: new Vec3(x, y, z),
        velocity: new Vec3(vx, vy, vz),
    };
}
