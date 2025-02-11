"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProgramRom16 = /** @class */ (function () {
    function ProgramRom16(lengthInBytes) {
        this.lengthInBytes = lengthInBytes;
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }
    ProgramRom16.prototype.get16 = function (address) {
        return this.dataView.getUint16(2 * address);
    };
    ProgramRom16.prototype.set16 = function (address, value) {
        this.dataView.setUint16(address * 2, value);
    };
    ProgramRom16.prototype.setHighLowBits = function (address, high8, low8) {
        this.dataView.setUint8(address * 2, high8);
        this.dataView.setUint8(address * 2 + 1, low8);
    };
    ProgramRom16.prototype.setWithImmadiate = function (address, immediate, C, OP) {
        var high = immediate;
        var low = (C << 4) | OP;
        this.setHighLowBits(address, high, low);
    };
    ProgramRom16.prototype.setPer4Bits = function (address, A, B, C, OP) {
        var high = (A << 4) | B;
        var low = (C << 4) | OP;
        this.setHighLowBits(address, high, low);
    };
    ProgramRom16.prototype.logPer4Bits = function (address) {
        console.log(this.stringPer4Bits(address));
    };
    ProgramRom16.prototype.toString = function () {
        var result = '';
        for (var i = 0; i < this.lengthInBytes; i++) {
            result += this.stringPer4Bits(i);
            if (i < this.lengthInBytes - 1) {
                result += ', ';
            }
        }
        return result;
    };
    ProgramRom16.prototype.stringPer4Bits = function (address) {
        var value = this.get16(address);
        var bits4_1 = ((value >> 12) & 15).toString(2).padStart(4, '0'); // Bits 15-12 -> A
        var bits4_2 = ((value >> 8) & 15).toString(2).padStart(4, '0'); // Bits 11-8  -> B
        var bits4_3 = ((value >> 4) & 15).toString(2).padStart(4, '0'); // Bits 7-4   -> C
        var bits4_4 = (value & 15).toString(2).padStart(4, '0'); // Bits 3-0   -> OPCODE
        return "Address: ".concat(address, ", Bits: ").concat(bits4_1, " ").concat(bits4_2, " ").concat(bits4_3, " ").concat(bits4_4);
    };
    return ProgramRom16;
}());
exports.default = ProgramRom16;
