type IntCode = number[];

export default class VM {
    private memory: number[];
    
    private instr: number = 0;
    private halted: boolean = false;

    constructor(
        private program: IntCode
    ) { }

    setMemory(pos: number, val: number): void {
        this.memory[pos] = val;
    }

    getMemory(pos: number): number {
        return this.memory[pos];
    }

    public reset(): void {
        this.memory = [...this.program];
        this.instr = 0;
        this.halted = false;
    }

    public run(): number {
        while (!this.halted) {
            let OP = this.memory[this.instr];
    
            switch (OP) {
                case 1:
                    this.memory[this.memory[this.instr+3]] = this.memory[this.memory[this.instr+1]] + this.memory[this.memory[this.instr+2]];
                break;
                case 2:
                    this.memory[this.memory[this.instr+3]] = this.memory[this.memory[this.instr+1]] * this.memory[this.memory[this.instr+2]];
                    break;
                case 99:
                    this.halted = true;
                    break;
            }
    
            this.instr += 4;
        }

        return this.memory[0];
    }
}