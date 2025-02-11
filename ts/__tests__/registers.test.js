"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var registers_1 = require("../src/registers");
var globals_1 = require("@jest/globals");
(0, globals_1.describe)('Registers', function () {
    var registers;
    (0, globals_1.beforeEach)(function () {
        // Inicializando registradores de r0 a r15
        var registerNames = Array.from({ length: 16 }, function (_, i) { return "r".concat(i); });
        registers = new registers_1.Registers(16);
        registers.setRegisterNames(registerNames);
    });
    (0, globals_1.it)('should initialize all registers to 0', function () {
        (0, globals_1.expect)(registers.toString()).toBe(Array.from({ length: 16 }, function (_, i) { return "r".concat(i, ": 0"); }).join(', '));
    });
    (0, globals_1.it)('should set and get values by address', function () {
        registers.set(2, 42);
        registers.set(1, 84);
        registers.set(15, 126);
        (0, globals_1.expect)(registers.get(2)).toBe(42);
        (0, globals_1.expect)(registers.get(1)).toBe(84);
        (0, globals_1.expect)(registers.get(15)).toBe(126);
    });
    (0, globals_1.it)('should set and get values by name', function () {
        registers.set(1, 99);
        (0, globals_1.expect)(registers.getByName('r1')).toBe(99);
        registers.set(1, 123);
        (0, globals_1.expect)(registers.getByName('r1')).toBe(123);
        registers.set(15, 77);
        (0, globals_1.expect)(registers.getByName('r15')).toBe(77);
    });
    (0, globals_1.it)('should throw error for invalid address', function () {
        (0, globals_1.expect)(function () { return registers.get(100); }).toThrowError();
    });
});
