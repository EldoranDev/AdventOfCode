import { } from '@lib/input';
import { Context } from '@app/types';

type Recipe = { 
    input: { 
        [resource: string]: number 
    },
    output: number,
};


export default function (input: string[], { logger }: Context) {
    const recipies: { [resource: string]: Recipe } = {};
    const production: {
        [resource: string]: {
            required: number,
            current: number,
            limited: boolean,
            available: number,
        }
    } = {};

    for (const line of input) {
        const parts = line.split('=>').map(p => p.trim());
        
        const inputLines = parts[0].split(',').map(p => p.trim());
        const input = {};

        for (const inp of inputLines) {
            const parts = inp.split(' ');
            input[parts[1]] = Number(parts[0]);
        }

        const outputParts = parts[1].split(' ');

        recipies[outputParts[1]] = {
            input,
            output: Number(outputParts[0]),
        };
    }

    for (const resource of Object.keys(recipies)) {
        production[resource] = {
            required: 0,
            current: 0,
            limited: false,
            available: 0,
        };
    }

    production['FUEL'].required = 1;
    production['ORE'] = {
        required: 0,
        current: 0,
        limited: true,
        available: 1000000000000,
    };

    let satisfied = true;
    let valid = true;

    do {
        satisfied = true;

        for (const resource of Object.keys(production)) {
            if (resource === 'ORE') {
                production['ORE'].current = production['ORE'].required;
                
                if (production['ORE'].required > production['ORE'].available) {
                    valid = false;
                    break;
                }

                continue;
            }

            const prod = production[resource];

            if (prod.required > prod.current) {
                
                const recipe = recipies[resource];

                const count = Math.ceil(
                    (prod.required - prod.current)/recipe.output
                );

                prod.current += count * recipe.output;

                for (const inpResoure of Object.keys(recipe.input)) {
                    production[inpResoure].required += recipe.input[inpResoure] * count;    
                }

                satisfied = false;
            }
        }

        if (satisfied) {
            production['FUEL'].required++;
        }

    } while (valid);

    logger.debug(`ORE: ${production['ORE']}`);

    // Naive non working
    return production['FUEL'].current - 1;
};