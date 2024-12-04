// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Array<T> {
    first(): T | undefined;
    last(): T | undefined;
}

// eslint-disable-next-line no-extend-native
Array.prototype.first = function () {
    return this[0] ?? undefined;
};

// eslint-disable-next-line no-extend-native
Array.prototype.last = function () {
    return this[this.length - 1] ?? undefined;
};
