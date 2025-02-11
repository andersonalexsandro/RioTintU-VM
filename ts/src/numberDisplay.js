"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NumberDisplay = /** @class */ (function () {
    function NumberDisplay(ram, initialAddress) {
        this.ram = ram;
        this.ramAlocated = new DataView(this.ram.getArrayBuffer(), initialAddress, NumberDisplay.nBytesAlocated);
        ;
    }
    NumberDisplay.prototype.set = function (addres, value) {
        this.ramAlocated.setUint8(addres, value);
    };
    NumberDisplay.prototype.get = function (addres) {
        return 0;
    };
    NumberDisplay.prototype.getramAlocated = function () {
        return this.ramAlocated;
    };
    NumberDisplay.prototype.toString = function () {
        return ("Display: " + this.ramAlocated.getUint16(0, true)); //Little-endian true: low 8bits are in the first index
    };
    NumberDisplay.nBytesAlocated = 2; //16 bits to display
    return NumberDisplay;
}());
exports.default = NumberDisplay;
