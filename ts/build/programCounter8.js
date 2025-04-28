export class ProgramCounter8 {
    counter;
    constructor(counter = 0) {
        this.counter = counter;
    }
    jump(address) {
        this.counter = address;
    }
    incremment() {
        this.counter == 255 ? this.counter = 0 : this.counter++;
    }
    getCounter() {
        return this.counter;
    }
    toString() {
        return "Program Counter: " + this.counter;
    }
}
