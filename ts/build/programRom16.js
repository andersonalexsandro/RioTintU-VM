"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProgramRom16 {
    constructor(lengthInBytes) {
        this.lengthInBytes = lengthInBytes;
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }
    get16(address) {
        return this.dataView.getUint16(2 * address);
    }
    set16(address, value) {
        this.dataView.setUint16(address * 2, value);
    }
    setHighLowBits(address, high8, low8) {
        this.dataView.setUint8(address * 2, high8);
        this.dataView.setUint8(address * 2 + 1, low8);
    }
    setWithImmadiate(address, immediate, C, OP) {
        const high = immediate;
        const low = (C << 4) | OP;
        this.setHighLowBits(address, high, low);
    }
    setPer4Bits(address, A, B, C, OP) {
        const high = (A << 4) | B;
        const low = (C << 4) | OP;
        this.setHighLowBits(address, high, low);
    }
    logPer4Bits(address) {
        console.log(this.stringPer4Bits(address));
    }
    toString() {
        let result = '';
        for (let i = 0; i < this.lengthInBytes; i++) {
            result += this.stringPer4Bits(i);
            if (i < this.lengthInBytes - 1) {
                result += ', ';
            }
        }
        return result;
    }
    stringPer4Bits(address) {
        const value = this.get16(address);
        const bits4_1 = ((value >> 12) & 0b1111).toString(2).padStart(4, '0'); // Bits 15-12 -> A
        const bits4_2 = ((value >> 8) & 0b1111).toString(2).padStart(4, '0'); // Bits 11-8  -> B
        const bits4_3 = ((value >> 4) & 0b1111).toString(2).padStart(4, '0'); // Bits 7-4   -> C
        const bits4_4 = (value & 0b1111).toString(2).padStart(4, '0'); // Bits 3-0   -> OPCODE
        return `Address: ${address}, Bits: ${bits4_1} ${bits4_2} ${bits4_3} ${bits4_4}`;
    }
}
exports.default = ProgramRom16;
