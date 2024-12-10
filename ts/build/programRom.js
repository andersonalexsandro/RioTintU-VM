"use strict";
class ProgramRom16 {
    constructor(nBytes) {
        this.lengthInBytes = nBytes;
        this.romAb = new ArrayBuffer(nBytes);
        this.rom = new DataView(this.romAb);
    }
    get16(address) {
        return this.rom.getUint16(2 * address);
    }
    set16(address, value) {
        this.rom.setUint16(address * 2, value);
    }
    setHighLowBits(address, high8, low8) {
        this.rom.setUint8(address, high8);
        this.rom.setUint8(address + 1, low8);
    }
    toString() {
        let toString = '';
        for (let i = 0; i < this.lengthInBytes; i++) {
            toString += `${i}: ${this.get16(i)}\n`;
        }
        return toString;
    }
}
