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
        }
    } = {};

    for (const line of input) {
        const parts = line.split('=>').map(p => p.trim());
        
        const inputLines = parts[0].split(',').map(p => p.trim());
        const input = {};

        for (let inp of inputLines) {
            const parts = inp.split(' ');
            input[parts[1]] = Number(parts[0]);
        }

        const outputParts = parts[1].split(' ');

        recipies[outputParts[1]] = {
            input,
            output: Number(outputParts[0]),
        };
    }

    for (let resource of Object.keys(recipies)) {
        production[resource] = {
            required: 0,
            current: 0,
        };
    }

    production['FUEL'].required = 1;
    production['ORE'] = {
        required: 0,
        current: 0,
    }

    let satisfied = true;

    do {
        satisfied = true;

        for (let resource of Object.keys(production)) {
            if (resource === 'ORE') {
                production['ORE'].current = production['ORE'].required;
                continue;
            }

            let prod = production[resource];

            if (prod.required > prod.current) {
                
                let recipe = recipies[resource];

                let count = Math.ceil(
                    (prod.required - prod.current)/recipe.output
                );

                prod.current += count * recipe.output;

                for (let inpResoure of Object.keys(recipe.input)) {
                    production[inpResoure].required += recipe.input[inpResoure] * count;    
                }

                satisfied = false;
            }
        }
    } while (!satisfied);

    // Naive non working
    return Math.floor(1000000000000/production['ORE'].required);
};