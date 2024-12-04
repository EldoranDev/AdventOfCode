import {} from "@lib/input";
import { Context } from "@app/types";

type Property = {
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
};

const INGREDIENTS: Array<Property> = [];

const EXTRACTOR =
    /(\w+): capacity (-?\d), durability (-?\d), flavor (-?\d). texture (-?\d), calories (-?\d)/;

let highest = 0;

export default function (input: string[], { logger }: Context) {
    for (const line of input) {
        const [, name, capacity, durability, flavor, texture, calories] = EXTRACTOR.exec(line)!;
        INGREDIENTS.push({
            capacity: Number(capacity),
            durability: Number(durability),
            flavor: Number(flavor),
            texture: Number(texture),
            calories: Number(calories),
        });
    }

    let a = 0;
    let b = 0;
    let c = 0;
    let d = 0;

    for (a = 0; a + b + c + d <= 100; a++) {
        for (b = 0; a + b + c + d <= 100; b++) {
            for (c = 0; a + b + c + d <= 100; c++) {
                for (d = 0; a + b + c + d <= 100; d++) {
                    const cap = Math.max(
                        0,
                        // eslint-disable-next-line max-len
                        a * INGREDIENTS[0].capacity +
                            b * INGREDIENTS[1].capacity +
                            c * INGREDIENTS[2].capacity +
                            d * INGREDIENTS[3].capacity,
                    );
                    // eslint-disable-next-line max-len
                    const dur = Math.max(
                        0,
                        a * INGREDIENTS[0].durability +
                            b * INGREDIENTS[1].durability +
                            c * INGREDIENTS[2].durability +
                            d * INGREDIENTS[3].durability,
                    );
                    // eslint-disable-next-line max-len
                    const fla = Math.max(
                        0,
                        a * INGREDIENTS[0].flavor +
                            b * INGREDIENTS[1].flavor +
                            c * INGREDIENTS[2].flavor +
                            d * INGREDIENTS[3].flavor,
                    );
                    // eslint-disable-next-line max-len
                    const tex = Math.max(
                        0,
                        a * INGREDIENTS[0].texture +
                            b * INGREDIENTS[1].texture +
                            c * INGREDIENTS[2].texture +
                            d * INGREDIENTS[3].texture,
                    );

                    const score = cap * dur * fla * tex;

                    if (score > highest) {
                        highest = score;
                    }
                }
                d = 0;
            }
            c = 0;
        }
        b = 0;
    }

    return highest;
}
