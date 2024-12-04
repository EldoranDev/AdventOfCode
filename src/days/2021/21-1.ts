import {} from "@lib/input";
import { Context } from "@app/types";
import { sum } from "@lib/math/functions";

const WINNING_SCORE = 1000;
const BOARD_SIZE = 10;
const DIE_SIZE = 100;

export default function (input: string[], { logger }: Context) {
    const [[_, in1], [__, in2]] = input.map((l) => l.split(":"));

    const POS = [Number(in1.trim()) - 1, Number(in2.trim()) - 1];

    const SCORES = [0, 0];

    const die = dice();

    let roleCount = 0;

    while (true) {
        for (let i = 0; i < 2; i++) {
            const roles = [die.next().value, die.next().value, die.next().value];

            const steps = sum(...roles);

            POS[i] = (POS[i] + steps) % BOARD_SIZE;

            roleCount += 3;

            SCORES[i] += POS[i] + 1;

            logger.debug(
                `Player ${i + 1} rolls ${roles} and moves to space ${POS[i] + 1} for a total score of ${SCORES[i]}.`,
            );

            if (SCORES[i] >= WINNING_SCORE) {
                return SCORES[(i + 1) % 2] * roleCount;
            }
        }
    }
}

function* dice(): Generator<number, number, number> {
    let count = 0;

    while (true) {
        yield count + 1;
        count = (count + 1) % DIE_SIZE;
    }
}
