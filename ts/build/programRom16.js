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
    setPer4Bits(address, bits1, bits2, bits3, bits4) {
        const highBits = (bits1 << 4) | bits2;
        const lowBits = (bits3 << 4) | bits4;
        this.setHighLowBits(address, highBits, lowBits);
    }
    logPer4Bits(address) {
        const value = this.get16(address);
        const bits4_1 = ((value >> 12) & 0b1111).toString(2).padStart(4, '0'); // Bits 15-12
        const bits4_2 = ((value >> 8) & 0b1111).toString(2).padStart(4, '0'); // Bits 11-8
        const bits4_3 = ((value >> 4) & 0b1111).toString(2).padStart(4, '0'); // Bits 7-4
        const bits4_4 = (value & 0b1111).toString(2).padStart(4, '0'); // Bits 3-0
        console.log(`PROM16- Address: ${address}, Bits: ${bits4_1} ${bits4_2} ${bits4_3} ${bits4_4}`);
    }
    toString() {
        let result = '';
        for (let i = 0; i < this.lengthInBytes; i++) {
            const value = this.get16(i);
            const bits4_1 = ((value >> 12) & 0b1111).toString(2).padStart(4, '0'); // Bits 15-12
            const bits4_2 = ((value >> 8) & 0b1111).toString(2).padStart(4, '0'); // Bits 11-8
            const bits4_3 = ((value >> 4) & 0b1111).toString(2).padStart(4, '0'); // Bits 7-4
            const bits4_4 = (value & 0b1111).toString(2).padStart(4, '0'); // Bits 3-0
            result += `Address: ${i}, Bits: ${bits4_1} ${bits4_2} ${bits4_3} ${bits4_4}`;
            if (i < this.lengthInBytes - 1) {
                result += ', ';
            }
        }
        return result;
    }
}
exports.default = ProgramRom16;
