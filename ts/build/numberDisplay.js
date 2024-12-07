"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NumberDisplay {
    constructor(ram, initialAddress) {
        this.ram = ram;
        this.ramAlocated = new DataView(this.ram.getArrayBuffer(), initialAddress, NumberDisplay.nBytesAlocated);
        ;
    }
    setValue(addres, value) {
        this.ramAlocated.setUint8(addres, value);
    }
    getValue(addres) {
        return 0;
    }
    getramAlocated() {
        return this.ramAlocated;
    }
    toString() {
        return ("Display: " + this.ramAlocated.getUint16(0, true)); //Little-endian true: low 8bits are in the first index
    }
}
NumberDisplay.nBytesAlocated = 2; //16 bits to display
exports.default = NumberDisplay;
