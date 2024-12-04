export class Hash {
    constructor(private bytes: number[]) {}

    public asHex(): string {
        let res: string = "";

        for (const byte of this.bytes) {
            res += byte.toString(16).padStart(2, "0");
        }

        return res;
    }

    public asBinary(): string {
        let res: string = "";

        for (const byte of this.bytes) {
            res += byte.toString(2).padStart(8, "0");
        }

        return res;
    }
}
