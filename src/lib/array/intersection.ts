export default function intersection<T>(...arrays: T[][]): T[] {
    const inter = [];

    if (arrays.length === 0) {
        return inter;
    }

    if (arrays.length === 1) {
        return arrays[0];
    }

    for (const array of arrays) {
        if (array.length === 0) {
            return inter;
        }
    }

    for (const el of arrays[0]) {
        let included = true;

        for (let i = 1; i < arrays.length; i++) {
            if (!arrays[i].includes(el)) {
                included = false;
                break;
            }
        }

        if (included) {
            inter.push(el);
        }
    }

    return inter;
}
