"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var cpu_1 = require("../src/cpu");
var ram_1 = require("../src/ram");
var programRom16_1 = require("../src/programRom16");
var registers_1 = require("../src/registers");
var flags_1 = require("../src/flags");
var programCounter8_1 = require("../src/programCounter8");
var numberDisplay_1 = require("../src/numberDisplay");
var memoryMapper_1 = require("../src/memoryMapper");
var screen_1 = require("../src/screen");
(0, globals_1.describe)('CPU', function () {
    var ramLength = 256;
    var screenStart = 246;
    var screenWidth = 32;
    var screenHeigth = 32;
    var numberDisplayStart = 252;
    var romLength = 512;
    var registersLength = 16;
    var cpu;
    var ram;
    var rom;
    var registers;
    var flags;
    var pc;
    var numberDisplay;
    var screen;
    var memoryMapper;
    (0, globals_1.beforeEach)(function () {
        rom = new programRom16_1.default(romLength);
        registers = new registers_1.Registers(registersLength);
        registers.setRegisterNames(['r0', 'r1', 'r2', 'r3', 'r4', 'r5,', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15']);
        flags = new flags_1.Flags();
        pc = new programCounter8_1.ProgramCounter8();
        ram = new ram_1.default(ramLength);
        screen = new screen_1.default(ram, screenStart, screenWidth, screenHeigth);
        numberDisplay = new numberDisplay_1.default(ram, numberDisplayStart);
        memoryMapper = new memoryMapper_1.default();
        memoryMapper.map(ram, 0, screenStart - 1, false);
        memoryMapper.map(screen, screenStart, screenStart + screen_1.default.nBytesAlocated - 1, true);
        memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + numberDisplay_1.default.nBytesAlocated - 1, true);
        cpu = new cpu_1.default(memoryMapper, rom, registers, flags, pc);
    });
    (0, globals_1.test)('fetch instructions', function () {
        rom.setWithImmadiate(0, 100, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, cpu_1.Instructions.ADD);
        (0, globals_1.expect)(cpu.fetch()).toBe(rom.get16(0));
        pc.incremment();
        (0, globals_1.expect)(cpu.fetch()).toBe(rom.get16(1));
    });
    (0, globals_1.test)('Program Counter', function () {
        for (var i = 0; i < 255; i++) {
            (0, globals_1.expect)(pc.getCounter()).toBe(i);
            rom.setWithImmadiate(i, 0, 1, cpu_1.Instructions.LDI);
            cpu.execute(cpu.fetch());
        }
    });
    (0, globals_1.test)('LDI', function () {
        rom.setWithImmadiate(0, 100, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, cpu_1.Instructions.LDI);
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(1);
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(2);
        registers.toString();
        (0, globals_1.expect)(registers.get(1)).toBe(100);
        (0, globals_1.expect)(registers.get(2)).toBe(155);
    });
    (0, globals_1.test)('ADD', function () {
        rom.setWithImmadiate(0, 100, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(255);
    });
    (0, globals_1.test)('SUB', function () {
        rom.setWithImmadiate(0, 1, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 2, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.SUB);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(255);
    });
    (0, globals_1.test)('NOR', function () {
        rom.setWithImmadiate(0, 170, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 224, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.NOR);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(21);
    });
    (0, globals_1.test)('AND', function () {
        rom.setWithImmadiate(0, 170, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 224, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.AND);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(160);
    });
    (0, globals_1.test)('XOR', function () {
        rom.setWithImmadiate(0, 170, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 224, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.XOR);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(74);
    });
    (0, globals_1.test)('Flags', function () {
        // Test for the COUT (Carry Out) flag
        rom.setWithImmadiate(0, 255, 1, cpu_1.Instructions.LDI); // Load 255 into r1
        rom.setWithImmadiate(1, 1, 2, cpu_1.Instructions.LDI); // Load 1 into r2
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD); // r3 = r1 + r2
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(flags.getCout()).toBe(true); // There should be a carry out
        (0, globals_1.expect)(flags.getEven()).toBe(true); // Result is even
        (0, globals_1.expect)(flags.getMsb()).toBe(false); // MSB is not set
        (0, globals_1.expect)(flags.getZero()).toBe(true); // Result is zero
        // ---------------------------------------------
        // Test for the ZERO flag
        rom.setWithImmadiate(3, 1, 1, cpu_1.Instructions.LDI); // Load 1 into r1
        rom.setWithImmadiate(4, 1, 2, cpu_1.Instructions.LDI); // Load 1 into r2
        rom.setPer4Bits(5, 1, 2, 3, cpu_1.Instructions.SUB); // r3 = r1 - r2
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(0); // r3 should be 0
        (0, globals_1.expect)(flags.getCout()).toBe(false); // There should be no carry out
        (0, globals_1.expect)(flags.getEven()).toBe(true); // Result is even
        (0, globals_1.expect)(flags.getMsb()).toBe(false); // MSB is not set
        (0, globals_1.expect)(flags.getZero()).toBe(true); // Result is zero
        // ---------------------------------------------
        // Test for the MSB (Most Significant Bit) flag
        rom.setWithImmadiate(6, 127, 1, cpu_1.Instructions.LDI); // Load 127 into r1
        rom.setWithImmadiate(7, 1, 2, cpu_1.Instructions.LDI); // Load 1 into r2
        rom.setPer4Bits(8, 1, 2, 3, cpu_1.Instructions.ADD); // r3 = r1 + r2
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(128); // r3 should be 128
        (0, globals_1.expect)(flags.getCout()).toBe(false); // There should be no carry out
        (0, globals_1.expect)(flags.getEven()).toBe(true); // Result is even
        (0, globals_1.expect)(flags.getMsb()).toBe(true); // MSB is set
        (0, globals_1.expect)(flags.getZero()).toBe(false); // Result is not zero
        // ---------------------------------------------
        // Test for the EVEN (Parity) flag
        rom.setWithImmadiate(9, 2, 1, cpu_1.Instructions.LDI); // Load 2 into r1
        rom.setWithImmadiate(10, 2, 2, cpu_1.Instructions.LDI); // Load 2 into r2
        rom.setPer4Bits(11, 1, 2, 3, cpu_1.Instructions.ADD); // r3 = r1 + r2
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(4); // r3 should be 4
        (0, globals_1.expect)(flags.getCout()).toBe(false); // There should be no carry out
        (0, globals_1.expect)(flags.getEven()).toBe(true); // Result is even
        (0, globals_1.expect)(flags.getMsb()).toBe(false); // MSB is not set
        (0, globals_1.expect)(flags.getZero()).toBe(false); // Result is not zero
        // ---------------------------------------------
        // Test for the NOT_EVEN (Odd) flag
        rom.setWithImmadiate(12, 1, 1, cpu_1.Instructions.LDI); // Load 1 into r1
        rom.setWithImmadiate(13, 2, 2, cpu_1.Instructions.LDI); // Load 2 into r2
        rom.setPer4Bits(14, 1, 2, 3, cpu_1.Instructions.ADD); // r3 = r1 + r2
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(3); // r3 should be 3
        (0, globals_1.expect)(flags.getCout()).toBe(false); // There should be no carry out
        (0, globals_1.expect)(flags.getEven()).toBe(false); // Result is odd
        (0, globals_1.expect)(flags.getMsb()).toBe(false); // MSB is not set
        (0, globals_1.expect)(flags.getZero()).toBe(false); // Result is not zero
    });
    (0, globals_1.test)('RSH', function () {
        rom.setWithImmadiate(0, 170, 1, cpu_1.Instructions.LDI);
        rom.setPer4Bits(1, 1, 0, 2, cpu_1.Instructions.RSH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(2)).toBe(85);
    });
    (0, globals_1.test)('ADI', function () {
        rom.setWithImmadiate(0, 170, 1, cpu_1.Instructions.ADI);
        rom.setWithImmadiate(1, 1, 1, cpu_1.Instructions.ADI);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(1)).toBe(171);
    });
    (0, globals_1.test)('JMP', function () {
        rom.setWithImmadiate(0, 255, 0, cpu_1.Instructions.JMP);
        rom.setWithImmadiate(255, 255, 1, cpu_1.Instructions.LDI);
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(1)).toBe(255);
    });
    (0, globals_1.test)('JID', function () {
        rom.setWithImmadiate(0, 1, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 254, 1, cpu_1.Instructions.JID);
        rom.setWithImmadiate(255, 255, 1, cpu_1.Instructions.LDI);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(1)).toBe(255);
    });
    (0, globals_1.test)('ADC', function () {
        rom.setWithImmadiate(0, 255, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setPer4Bits(3, 1, 2, 3, cpu_1.Instructions.ADC);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(1);
    });
    (0, globals_1.test)('STR', function () {
        rom.setWithImmadiate(0, 100, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 2, 0, 1, cpu_1.Instructions.STR);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(ram.get(1)).toBe(100);
    });
    (0, globals_1.test)('LOD', function () {
        rom.setWithImmadiate(0, 100, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 2, 0, 1, cpu_1.Instructions.STR);
        rom.setPer4Bits(3, 2, 0, 3, cpu_1.Instructions.LOD);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(100);
    });
    (0, globals_1.test)('LOD', function () {
        rom.setWithImmadiate(0, 100, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 2, 0, 1, cpu_1.Instructions.STR);
        rom.setPer4Bits(3, 2, 0, 3, cpu_1.Instructions.LOD);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(registers.get(3)).toBe(100);
    });
    (0, globals_1.test)('BRH with COUT', function () {
        rom.setWithImmadiate(0, 255, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setWithImmadiate(3, 255, flags_1.FlagCode.COUT, cpu_1.Instructions.BRH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
    });
    (0, globals_1.test)('BRH with NOT_ZERO flag', function () {
        rom.setWithImmadiate(0, 1, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setWithImmadiate(3, 255, flags_1.FlagCode.NOT_ZERO, cpu_1.Instructions.BRH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
    });
    (0, globals_1.test)('BRH with ZERO flag', function () {
        rom.setWithImmadiate(0, 0, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 0, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setWithImmadiate(3, 255, flags_1.FlagCode.ZERO, cpu_1.Instructions.BRH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
    });
    (0, globals_1.test)('BRH with NOT_COUT flag', function () {
        rom.setWithImmadiate(0, 0, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 0, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setWithImmadiate(3, 255, flags_1.FlagCode.NOT_COUT, cpu_1.Instructions.BRH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
    });
    (0, globals_1.test)('BRH with MSB flag', function () {
        rom.setWithImmadiate(0, 128, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 0, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setWithImmadiate(3, 255, flags_1.FlagCode.MSB, cpu_1.Instructions.BRH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
    });
    (0, globals_1.test)('BRH with NOT_MSB flag', function () {
        rom.setWithImmadiate(0, 127, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 0, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setWithImmadiate(3, 255, flags_1.FlagCode.NOT_MSB, cpu_1.Instructions.BRH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
    });
    (0, globals_1.test)('BRH with EVEN flag', function () {
        rom.setWithImmadiate(0, 2, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 2, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setWithImmadiate(3, 255, flags_1.FlagCode.EVEN, cpu_1.Instructions.BRH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
    });
    (0, globals_1.test)('BRH with NOT_EVEN flag', function () {
        rom.setWithImmadiate(0, 1, 1, cpu_1.Instructions.LDI);
        rom.setWithImmadiate(1, 2, 2, cpu_1.Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, cpu_1.Instructions.ADD);
        rom.setWithImmadiate(3, 255, flags_1.FlagCode.NOT_EVEN, cpu_1.Instructions.BRH);
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        (0, globals_1.expect)(pc.getCounter()).toBe(255);
    });
});
