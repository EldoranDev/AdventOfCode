import {} from "@lib/input";
import { Context } from "@app/types";
import { Logger } from "winston";

class Package {
    public constructor(
        public version: number,
        public type: number,
        public literal?: number,

        public lengthId?: number,
        public length?: number,

        public packages?: Package[],
    ) {}

    public get value() {
        switch (this.type) {
            case 0:
                return this.packages.reduce((p, c) => p + c.value, 0);
            case 1:
                return this.packages.reduce((p, c) => p * c.value, 1);
            case 2:
                return Math.min(...this.packages.map((p) => p.value));
            case 3:
                return Math.max(...this.packages.map((p) => p.value));
            case 4:
                return this.literal;
            case 5:
                return this.packages[0].value > this.packages[1].value ? 1 : 0;
            case 6:
                return this.packages[0].value < this.packages[1].value ? 1 : 0;
            case 7:
                return this.packages[0].value === this.packages[1].value ? 1 : 0;
            default:
                throw Error("INVALID");
        }
    }
}

export default function (input: string[], { logger }: Context) {
    let message = "";

    for (const char of input[0]) {
        message += parseInt(char, 16).toString(2).padStart(4, "0");
    }

    logger.debug(message);

    const [pkg] = parsePackage(message, 0, logger);

    console.log(pkg);

    return pkg.value;
}

function parsePackage(binary: string, pointer: number, logger: Logger): [Package, number] {
    let readBits = 0;
    const version = parseInt(binary.substring(pointer, pointer + 3), 2);
    pointer += 3;
    readBits += 3;

    const type = parseInt(binary.substring(pointer, pointer + 3), 2);
    pointer += 3;
    readBits += 3;

    const pkg: Package = new Package(version, type);

    let bits = 0;

    switch (type) {
        case 4:
            bits = parseLiteral(pkg, binary, pointer, logger);
            break;
        default:
            bits = parseOperator(pkg, binary, pointer, logger);
            break;
    }

    readBits += bits;

    return [pkg, readBits];
}

function parseOperator(pkg: Package, binary: string, pointer: number, logger: Logger): number {
    let readBits = 0;

    pkg.lengthId = Number(binary.substring(pointer, pointer + 1));

    readBits += 1;
    pointer += 1;

    pkg.packages = [];

    switch (pkg.lengthId) {
        case 0:
            pkg.length = parseInt(binary.substring(pointer, pointer + 15), 2);
            readBits += 15;
            pointer += 15;

            let bitsLeft = pkg.length;

            while (bitsLeft > 0) {
                const [subPkg, bits] = parsePackage(binary, pointer, logger);

                pkg.packages.push(subPkg);
                bitsLeft -= bits;
                readBits += bits;
                pointer += bits;
            }

            break;
        case 1:
            pkg.length = parseInt(binary.substring(pointer, pointer + 11), 2);
            readBits += 11;
            pointer += 11;

            while (pkg.packages.length < pkg.length) {
                const [subPkg, bits] = parsePackage(binary, pointer, logger);

                pkg.packages.push(subPkg);
                readBits += bits;
                pointer += bits;
            }
            break;
    }

    return readBits;
}

function parseLiteral(pkg: Package, binary: string, pointer: number, logger: Logger): number {
    let last = false;

    let num = "";
    let readBytes = 0;

    while (!last) {
        const current = binary.substring(pointer + readBytes, pointer + readBytes + 5);

        if (current[0] === "0") {
            last = true;
        }

        num += current.substring(1);

        readBytes += 5;
    }

    pkg.literal = parseInt(num, 2);

    return readBytes;
}
