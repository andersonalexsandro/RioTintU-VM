"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramCounter8 = void 0;
var ProgramCounter8 = /** @class */ (function () {
    function ProgramCounter8(counter) {
        if (counter === void 0) { counter = 0; }
        this.counter = counter;
    }
    ProgramCounter8.prototype.jump = function (address) {
        this.counter = address;
    };
    ProgramCounter8.prototype.incremment = function () {
        this.counter == 255 ? this.counter = 0 : this.counter++;
    };
    ProgramCounter8.prototype.getCounter = function () {
        return this.counter;
    };
    ProgramCounter8.prototype.toString = function () {
        return "Program Counter: " + this.counter;
    };
    return ProgramCounter8;
}());
exports.ProgramCounter8 = ProgramCounter8;
