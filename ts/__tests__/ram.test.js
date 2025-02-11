"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var ram_1 = require("../src/ram");
var length = 256;
var ram;
(0, globals_1.beforeEach)(function () {
    ram = new ram_1.default(length);
});
(0, globals_1.test)("should return the correct length in bytes", function () {
    (0, globals_1.expect)(ram.getLengthInBytes()).toBe(length);
});
(0, globals_1.test)('Verify set and get of every single Address', function () {
    for (var i = 0; i < length; i++) {
        ram.set(i, i);
        (0, globals_1.expect)(ram.get(i)).toBe(i);
        ram.set(i, 255);
        (0, globals_1.expect)(ram.get(i)).toBe(255);
    }
});
(0, globals_1.test)('Test out of bounds', function () {
    (0, globals_1.expect)(function () { return ram.set(256, 255); }).toThrowError(); //ram goes from 0 until 255
    (0, globals_1.expect)(function () { return ram.set(-1, 255); }).toThrowError();
});
