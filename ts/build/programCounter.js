"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramCounter = void 0;
class ProgramCounter {
    constructor(counter = 0) {
        this.counter = counter;
    }
    jump(address) {
        this.counter = address;
    }
    incremment() {
        this.counter++;
    }
    getCounter() {
        return this.counter;
    }
    toString() {
        return "Program Counter: " + this.counter;
    }
}
exports.ProgramCounter = ProgramCounter;
