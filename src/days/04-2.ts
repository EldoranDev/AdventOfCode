type Passport = Record<string, any>;

const REQUIRED = [
    'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'
]

const RULES = {
    byr: (val: string) => Number(val) >= 1920 && Number(val) <= 2002,
    iyr: (val: string) => Number(val) >= 2010 && Number(val) <= 2020,
    eyr: (val: string) => Number(val) >= 2020 && Number(val) <= 2030,
    hgt: (val: string) => {
        const res = val.match(/([0-9]*)(cm|in)/);

        if (res === null) return false;
        
        switch(res[2]) {
            case 'cm':
                return Number(res[1]) >= 150 && Number(res[1]) <= 193;
            case 'in':
                return Number(res[1]) >= 59 && Number(res[1]) < 76;
        }

        return false;
    },
    hcl: (val: string) => val.length === 7 && /#[0-9a-f]{6}/.test(val),
    ecl: (val: string) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val),
    pid: (val: string) => val.length === 9,
};

export default function (input: string[]) {
    let passport: Passport = {};

    let valid: number = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i].trimRight() === "") {
            if (checkValid(passport)) {
                valid++;
            }

            passport = {};
        }

        const parts = input[i].split(' ');

        for (const part of parts) {
            const [ key, value ] = part.split(':');

            passport[key] = value;
        }
    }

    if(checkValid(passport)) {
        valid++;
    }

    return valid;
};

function checkValid(passport: Passport): boolean {
    const fields = Object.keys(RULES);

    for (const field of fields) {
        if (!(passport[field] !== undefined && RULES[field](passport[field]))) {
            return false;
        }
    }

    return true;
}