import { } from '@lib/input';
import { Context } from '@app/types';
import { Logger } from 'winston';

interface Package {
    version: number;
    type: number;
    value?: number;

    lengthId?: number;
    length?: number;

    packages?: Package[];

}

export default function (input: string[], { logger }: Context) {

    let message = "";

    for (let char of input[0]) {
        message += parseInt(char, 16).toString(2).padStart(4, "0");
    }

    logger.debug(message);

    const [ pkg ] = parsePackage(message, 0, logger);

    return countVersion(pkg);
};

function countVersion (pkg: Package): number {
    return pkg.version + ((pkg.packages) ? pkg.packages.reduce((p, c) => p + countVersion(c), 0) : 0);
}

function parsePackage(binary: string, pointer: number, logger: Logger): [Package, number] {
    let readBits = 0;
    let version = parseInt(binary.substring(pointer, pointer + 3), 2);
    pointer += 3;
    readBits += 3;

    let type = parseInt(binary.substring(pointer, pointer + 3), 2);
    pointer += 3;
    readBits += 3;

    let pkg: Package = {
        version,
        type,
    }
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

    pkg.lengthId = Number(binary.substring(pointer, pointer+1));

    readBits += 1;
    pointer += 1;

    pkg.packages = [];

    switch(pkg.lengthId) {
        case 0:
            pkg.length = parseInt(binary.substring(pointer, pointer + 15), 2);
            readBits += 15;
            pointer += 15;

            let bitsLeft = pkg.length;

            while (bitsLeft > 0) {
                let [ subPkg, bits ] = parsePackage(binary, pointer, logger);

                pkg.packages.push(subPkg);
                bitsLeft -= bits;
                readBits += bits;
                pointer += bits;
            }


            break;
        case 1:
            pkg.length = parseInt(binary.substring(pointer, pointer + 11), 2)
            readBits += 11;
            pointer += 11;

            while (pkg.packages.length < pkg.length) {
                let [ subPkg, bits ] = parsePackage(binary, pointer, logger);

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
        let current = binary.substring(pointer + readBytes, pointer + readBytes+5);

        if (current[0] === '0') {
            last = true;    
        }

        num += current.substring(1);
        
        readBytes += 5;
    }

    pkg.value = parseInt(num, 2);

    return readBytes;
}