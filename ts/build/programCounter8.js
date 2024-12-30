"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramCounter8 = void 0;
class ProgramCounter8 {
    constructor(counter = 0) {
        this.counter = counter;
    }
    jump(address) {
        this.counter = address;
    }
    incremment() {
        this.counter > 255 ? this.counter = 0 : this.counter++;
    }
    getCounter() {
        return this.counter;
    }
    toString() {
        return "Program Counter: " + this.counter;
    }
}
exports.ProgramCounter8 = ProgramCounter8;
