"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var programCounter8_1 = require("../src/programCounter8");
var globals_1 = require("@jest/globals");
(0, globals_1.describe)('ProgramCounter8', function () {
    var pc;
    (0, globals_1.beforeEach)(function () {
        pc = new programCounter8_1.ProgramCounter8(); // Inicializa o contador com o valor padrão (0)
    });
    (0, globals_1.test)('should initialize with default value', function () {
        (0, globals_1.expect)(pc.toString()).toBe('Program Counter: 0');
    });
    (0, globals_1.test)('should initialize with a specified value', function () {
        pc = new programCounter8_1.ProgramCounter8(10); // Inicializa com valor 10
        (0, globals_1.expect)(pc.toString()).toBe('Program Counter: 10');
    });
    (0, globals_1.test)('should jump to a specific address', function () {
        pc.jump(15);
        (0, globals_1.expect)(pc.toString()).toBe('Program Counter: 15');
    });
    (0, globals_1.test)('should increment the counter', function () {
        pc.incremment();
        (0, globals_1.expect)(pc.toString()).toBe('Program Counter: 1');
        pc.incremment();
        (0, globals_1.expect)(pc.toString()).toBe('Program Counter: 2');
    });
    (0, globals_1.test)('should handle jump and increment combined', function () {
        pc.jump(100);
        (0, globals_1.expect)(pc.toString()).toBe('Program Counter: 100');
        pc.incremment();
        (0, globals_1.expect)(pc.toString()).toBe('Program Counter: 101');
    });
});
