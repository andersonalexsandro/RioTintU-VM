"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var ram_1 = require("../src/ram");
var numberDisplay_1 = require("../src/numberDisplay");
var initialAddress = 252;
var ramLength = 256;
var ram;
var numberDisplay;
(0, globals_1.beforeEach)(function () {
    ram = new ram_1.default(ramLength);
    numberDisplay = new numberDisplay_1.default(ram, initialAddress);
});
(0, globals_1.test)("must share ram speace 252 and 253", function () {
    for (var i = 0; i <= 255; i++) {
        ram.set(252, i);
        (0, globals_1.expect)(numberDisplay.getramAlocated().getUint8(0)).toBe(i);
        ram.set(253, i);
        (0, globals_1.expect)(numberDisplay.getramAlocated().getUint8(1)).toBe(i);
    }
});
(0, globals_1.test)("Display Number", function () {
    // 16 Bit biggest number
    for (var i = 0; i <= 65535; i++) {
        ram.set(252, i & 255);
        ram.set(253, i >> 8 & 255);
        (0, globals_1.expect)(numberDisplay.toString()).toBe("Display: " + i);
    }
});
