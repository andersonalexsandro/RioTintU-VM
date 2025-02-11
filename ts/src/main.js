"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = exports.MemoryMapper = exports.Screen = exports.NumberDisplay = exports.ProgramCounter8 = exports.Flags = exports.Registers = exports.ProgramRom16 = exports.CPU = void 0;
exports.RioTintUInit = RioTintUInit;
var cpu_1 = require("./cpu");
exports.CPU = cpu_1.default;
var flags_1 = require("./flags");
Object.defineProperty(exports, "Flags", { enumerable: true, get: function () { return flags_1.Flags; } });
var memoryMapper_1 = require("./memoryMapper");
exports.MemoryMapper = memoryMapper_1.default;
var numberDisplay_1 = require("./numberDisplay");
exports.NumberDisplay = numberDisplay_1.default;
var programCounter8_1 = require("./programCounter8");
Object.defineProperty(exports, "ProgramCounter8", { enumerable: true, get: function () { return programCounter8_1.ProgramCounter8; } });
var programRom16_1 = require("./programRom16");
exports.ProgramRom16 = programRom16_1.default;
var ram_1 = require("./ram");
var registers_1 = require("./registers");
Object.defineProperty(exports, "Registers", { enumerable: true, get: function () { return registers_1.Registers; } });
var screen_1 = require("./screen");
exports.Screen = screen_1.default;
var assembler_1 = require("./assembler/assembler");
Object.defineProperty(exports, "Assembler", { enumerable: true, get: function () { return assembler_1.Assembler; } });
function RioTintUInit() {
    var ramLength = 256;
    var screenStart = 246;
    var screenWidth = 32;
    var screenHeigth = 32;
    var numberDisplayStart = 252;
    var romLength = 512;
    var registersLength = 16;
    var rom = new programRom16_1.default(romLength);
    var registers = new registers_1.Registers(registersLength);
    registers.setRegisterNames(['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15']);
    var flags = new flags_1.Flags();
    var pc = new programCounter8_1.ProgramCounter8();
    var ram = new ram_1.default(ramLength);
    var screen = new screen_1.default(ram, screenStart, screenWidth, screenHeigth);
    var numberDisplay = new numberDisplay_1.default(ram, numberDisplayStart);
    var memoryMapper = new memoryMapper_1.default();
    memoryMapper.map(ram, 0, screenStart - 1, false);
    memoryMapper.map(screen, screenStart, screenStart + screen_1.default.nBytesAlocated - 1, true);
    memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + numberDisplay_1.default.nBytesAlocated - 1, true);
    var cpu = new cpu_1.default(memoryMapper, rom, registers, flags, pc);
    var assembler = new assembler_1.Assembler();
    return {
        cpu: cpu,
        ram: ram,
        rom: rom,
        registers: registers,
        flags: flags,
        pc: pc,
        numberDisplay: numberDisplay,
        screen: screen,
        memoryMapper: memoryMapper,
        assembler: assembler
    };
}
