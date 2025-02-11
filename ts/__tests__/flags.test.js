"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flags_1 = require("../src/flags");
var globals_1 = require("@jest/globals");
(0, globals_1.describe)('Flags', function () {
    var flags;
    (0, globals_1.beforeEach)(function () {
        flags = new flags_1.Flags();
    });
    (0, globals_1.it)('should initialize flags to default values', function () {
        (0, globals_1.expect)(flags.getZero()).toBe(false);
        (0, globals_1.expect)(flags.getCout()).toBe(false);
        (0, globals_1.expect)(flags.getMsb()).toBe(false);
        (0, globals_1.expect)(flags.getEven()).toBe(false);
    });
    (0, globals_1.it)('should set individual flags correctly', function () {
        flags.setZero(true);
        (0, globals_1.expect)(flags.getZero()).toBe(true);
        flags.setCout(true);
        (0, globals_1.expect)(flags.getCout()).toBe(true);
        flags.setMsb(true);
        (0, globals_1.expect)(flags.getMsb()).toBe(true);
        flags.setEven(true);
        (0, globals_1.expect)(flags.getEven()).toBe(true);
    });
    (0, globals_1.it)('should calculate flags using setFlags with result 0', function () {
        flags.setFlags(0);
        (0, globals_1.expect)(flags.getZero()).toBe(true);
        (0, globals_1.expect)(flags.getCout()).toBe(false);
        (0, globals_1.expect)(flags.getMsb()).toBe(false);
        (0, globals_1.expect)(flags.getEven()).toBe(true);
    });
    (0, globals_1.it)('should calculate flags using setFlags with an odd number', function () {
        flags.setFlags(5); // Binary: 00000101
        (0, globals_1.expect)(flags.getZero()).toBe(false);
        (0, globals_1.expect)(flags.getCout()).toBe(false);
        (0, globals_1.expect)(flags.getMsb()).toBe(false);
        (0, globals_1.expect)(flags.getEven()).toBe(false);
    });
    (0, globals_1.it)('should calculate flags using setFlags with an even number', function () {
        flags.setFlags(4); // Binary: 00000100
        (0, globals_1.expect)(flags.getZero()).toBe(false);
        (0, globals_1.expect)(flags.getCout()).toBe(false);
        (0, globals_1.expect)(flags.getMsb()).toBe(false);
        (0, globals_1.expect)(flags.getEven()).toBe(true);
    });
    (0, globals_1.it)('should calculate flags using setFlags with an overflow value', function () {
        flags.setFlags(384); // Binary: 100101100 (overflow for 8-bit)
        (0, globals_1.expect)(flags.getZero()).toBe(false);
        (0, globals_1.expect)(flags.getCout()).toBe(true); // > 255
        (0, globals_1.expect)(flags.getMsb()).toBe(true); // Most significant bit is 1
        (0, globals_1.expect)(flags.getEven()).toBe(true); // Odd number
    });
    (0, globals_1.it)('should return a correct string representation', function () {
        flags.setZero(true);
        flags.setCout(false);
        flags.setMsb(true);
        flags.setEven(true);
        (0, globals_1.expect)(flags.toString()).toBe('Flags: { zero: true, cout: false, msb: true, even: true }');
    });
});
