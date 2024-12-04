type Passport = Record<string, any>;

const REQUIRED = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

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

        const parts = input[i].split(" ");

        for (const part of parts) {
            const [key, value] = part.split(":");

            passport[key] = value;
        }
    }

    if (checkValid(passport)) {
        valid++;
    }

    return valid;
}

function checkValid(passport: Passport): boolean {
    console.log(passport);
    for (const field of REQUIRED) {
        if (passport[field] === undefined) {
            return false;
        }
    }

    return true;
}
