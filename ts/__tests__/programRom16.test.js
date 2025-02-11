"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decToBin = decToBin;
var globals_1 = require("@jest/globals");
var programRom16_1 = require("../src/programRom16");
var programCounter8_1 = require("../src/programCounter8");
var cpu_1 = require("../src/cpu");
var length = 512;
var romTotalAddresses = 256;
var pc;
var rom;
(0, globals_1.describe)('ProgramRom16', function () {
    (0, globals_1.beforeEach)(function () {
        rom = new programRom16_1.default(length);
        pc = new programCounter8_1.ProgramCounter8();
    });
    (0, globals_1.test)('should set and get the next instruction correctly', function () {
        for (var i = 0; i < romTotalAddresses; i++) {
            rom.set16(pc.getCounter(), i);
            (0, globals_1.expect)(rom.get16(i)).toBe(i);
            pc.incremment();
        }
    });
    (0, globals_1.test)('should set and get high and low bits correctly', function () {
        for (var i = 0; i <= 65535; i++) {
            var low = (i & 255);
            var high = (i >> 8 & 255);
            rom.setHighLowBits(255, high, low);
            (0, globals_1.expect)(rom.get16(255)).toBe(i);
        }
    });
    (0, globals_1.test)('should set by 4 Bits', function () {
        for (var i = 0; i <= 65535; i++) {
            var bits4 = (i & 15);
            var bits3 = (i >> 4 & 15);
            var bits2 = (i >> 8 & 15);
            var bits1 = (i >> 12 & 15);
            rom.setPer4Bits(255, bits1, bits2, bits3, bits4);
            (0, globals_1.expect)(rom.get16(255)).toBe(i);
        }
    });
    (0, globals_1.test)('fetch instructions', function () {
        rom.setPer4Bits(0, 0, 1, 1, cpu_1.Instructions.LDI);
        (0, globals_1.expect)(rom.stringPer4Bits(pc.getCounter())).toBe("Address: 0, Bits: 0000 0001 0001 ".concat(decToBin(cpu_1.Instructions.LDI)));
    });
});
function decToBin(decimal, length, spaceBetween) {
    var _a;
    if (length === void 0) { length = 4; }
    if (spaceBetween === void 0) { spaceBetween = false; }
    var binaryString = decimal.toString(2).padStart(length, '0');
    if (spaceBetween) {
        // Add spaces between each group of 4 bits
        binaryString = binaryString.padStart(Math.ceil(binaryString.length / 4) * 4, '0');
        binaryString = ((_a = binaryString.match(/.{1,4}/g)) === null || _a === void 0 ? void 0 : _a.join(' ')) || binaryString;
    }
    return binaryString;
}
