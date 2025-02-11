"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var assembler_1 = require("../src/assembler/assembler");
var cpu_1 = require("../src/cpu"); // Certifique-se de que `Instructions` contém todos os opcodes necessários.
var flags_1 = require("../src/flags");
(0, globals_1.describe)('Assembler', function () {
    var assembler = new assembler_1.default();
    var registers = [
        'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7',
        'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15',
    ];
    (0, globals_1.test)('LDI r1 10', function () {
        var assembly = ['LDI r1 10'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r1 = toBinary(registers.indexOf('r1'), 4);
        var immediate = toBinary(10, 8);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r1 + opcode);
    });
    (0, globals_1.test)('LDI using define', function () {
        var assembly = [
            'DEFINE VALUE 42',
            'LDI r2 VALUE'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r2 = toBinary(registers.indexOf('r2'), 4);
        var immediate = toBinary(42, 8); // VALUE resolves to 42
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r2 + opcode);
    });
    (0, globals_1.test)('LDI using define', function () {
        var assembly = [
            'define x r1',
            'LDI x 0'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r1 = toBinary(registers.indexOf('r1'), 4);
        var immediate = toBinary(0, 8); // VALUE resolves to 42
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r1 + opcode);
    });
    (0, globals_1.test)('ADD r4 r2 r3', function () {
        var assembly = ['ADD r4 r2 r3'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADD, 4);
        var r2 = toBinary(registers.indexOf('r2'), 4);
        var r3 = toBinary(registers.indexOf('r3'), 4);
        var r4 = toBinary(registers.indexOf('r4'), 4);
        (0, globals_1.expect)(assembled[0]).toBe(r2 + r3 + r4 + opcode);
    });
    (0, globals_1.test)('SUB r7 r5 r6', function () {
        var assembly = ['SUB r7 r5 r6'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.SUB, 4);
        var r5 = toBinary(registers.indexOf('r5'), 4);
        var r6 = toBinary(registers.indexOf('r6'), 4);
        var r7 = toBinary(registers.indexOf('r7'), 4);
        (0, globals_1.expect)(assembled[0]).toBe(r5 + r6 + r7 + opcode);
    });
    (0, globals_1.test)('XOR r10 r8 r9', function () {
        var assembly = ['XOR r10 r8 r9'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.XOR, 4);
        var r8 = toBinary(registers.indexOf('r8'), 4);
        var r9 = toBinary(registers.indexOf('r9'), 4);
        var r10 = toBinary(registers.indexOf('r10'), 4);
        (0, globals_1.expect)(assembled[0]).toBe(r8 + r9 + r10 + opcode);
    });
    (0, globals_1.test)('AND r13 r11 r12', function () {
        var assembly = ['AND r13 r11 r12'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.AND, 4);
        var r11 = toBinary(registers.indexOf('r11'), 4);
        var r12 = toBinary(registers.indexOf('r12'), 4);
        var r13 = toBinary(registers.indexOf('r13'), 4);
        (0, globals_1.expect)(assembled[0]).toBe(r11 + r12 + r13 + opcode);
    });
    (0, globals_1.test)('RSH r1 r2', function () {
        var assembly = ['RSH r1 r2'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.RSH, 4);
        var r1 = toBinary(registers.indexOf('r1'), 4);
        var r2 = toBinary(registers.indexOf('r2'), 4);
        (0, globals_1.expect)(assembled[0]).toBe(r2 + '0000' + r1 + opcode);
    });
    (0, globals_1.test)('ADI r1 1', function () {
        var assembly = ['ADI r1 1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADI, 4);
        var r1 = toBinary(registers.indexOf('r1'), 4);
        var immediate = toBinary(1, 8);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r1 + opcode);
    });
    (0, globals_1.test)('ADI using define', function () {
        var assembly = [
            'DEFINE VALUE 20',
            'ADI r1 VALUE'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADI, 4);
        var r1 = toBinary(registers.indexOf('r1'), 4);
        var immediate = toBinary(20, 8); // VALUE resolves to 20
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r1 + opcode);
    });
    (0, globals_1.test)('JMP using immediate value', function () {
        var assembly = ['JMP 10'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.JMP, 4);
        var immediate = toBinary(10, 8); // Literal value 10
        (0, globals_1.expect)(assembled[0]).toBe(immediate + '0000' + opcode);
    });
    (0, globals_1.test)('JMP using label', function () {
        var assembly = ['.label', 'JMP .label'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.JMP, 4);
        var immediate = toBinary(0, 8); // `.label` resolves to address 0
        (0, globals_1.expect)(assembled[0]).toBe(immediate + '0000' + opcode);
    });
    (0, globals_1.test)('JMP using define', function () {
        var assembly = ['DEFINE CONST 15', 'JMP CONST'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.JMP, 4);
        var immediate = toBinary(15, 8); // Defined constant resolves to 15
        (0, globals_1.expect)(assembled[0]).toBe(immediate + '0000' + opcode);
    });
    (0, globals_1.test)('BRH >0', function () {
        var assembly = ['BRH >0 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_MSB, 4);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH <0', function () {
        var assembly = ['BRH <0 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.MSB, 4);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH <', function () {
        var assembly = ['BRH < 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_COUT, 4);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH >=', function () {
        var assembly = ['BRH >= 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.COUT, 4);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH =', function () {
        var assembly = ['BRH = 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.ZERO, 4);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH !=', function () {
        var assembly = ['BRH != 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_ZERO, 4);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH !%2', function () {
        var assembly = ['BRH !%2 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_EVEN, 4);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH %2', function () {
        var assembly = ['BRH %2 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.EVEN, 4);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH pos', function () {
        var assembly = ['BRH pos 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_MSB, 4); // Same as >0
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH neg', function () {
        var assembly = ['BRH neg 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.MSB, 4); // Same as <0
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH lt', function () {
        var assembly = ['BRH lt 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_COUT, 4); // Same as <
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH ge', function () {
        var assembly = ['BRH ge 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.COUT, 4); // Same as >=
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH eq', function () {
        var assembly = ['BRH eq 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.ZERO, 4); // Same as =
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH ne', function () {
        var assembly = ['BRH ne 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_ZERO, 4); // Same as !=
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH odd', function () {
        var assembly = ['BRH odd 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_EVEN, 4); // Same as !%2
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH even', function () {
        var assembly = ['BRH even 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.EVEN, 4); // Same as %2
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH notmsb', function () {
        var assembly = ['BRH notmsb 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_MSB, 4); // Same as pos or >0
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH msb', function () {
        var assembly = ['BRH msb 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.MSB, 4); // Same as neg or <0
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH notcarry', function () {
        var assembly = ['BRH notcarry 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_COUT, 4); // Same as lt or <
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH carry', function () {
        var assembly = ['BRH carry 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.COUT, 4); // Same as ge or >=
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH zero', function () {
        var assembly = ['BRH zero 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.ZERO, 4); // Same as eq or =
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH notzero', function () {
        var assembly = ['BRH notzero 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_ZERO, 4); // Same as ne or !=
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH noteven', function () {
        var assembly = ['BRH noteven 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.NOT_EVEN, 4); // Same as odd or !%2
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH even (symbol)', function () {
        var assembly = ['BRH even 1'];
        var assembled = assembler.assemble(assembly);
        var immediate = toBinary(1, 8);
        var condition = toBinary(flags_1.FlagCode.EVEN, 4); // Same as %2
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH with define', function () {
        var assembly = ['define x 10', 'BRH = x'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        var condition = toBinary(flags_1.FlagCode.ZERO, 4);
        var immediate = toBinary(10, 8);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    (0, globals_1.test)('BRH with label', function () {
        var assembly = ['.x', 'BRH = .x'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.BRH, 4);
        var condition = toBinary(flags_1.FlagCode.ZERO, 4);
        var immediate = toBinary(0, 8);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + condition + opcode);
    });
    var baseAddress = 246; // Base address for ports
    (0, globals_1.test)('LDI using port clear_sreen_buffer', function () {
        var assembly = ['LDI r1 clear_sreen_buffer'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r1 = toBinary(1, 4); // Register r1
        var immediate = toBinary(baseAddress, 8); // Address of 'clear_sreen_buffer'
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r1 + opcode);
    });
    (0, globals_1.test)('LDI using port buffer_screen', function () {
        var assembly = ['LDI r2 buffer_screen'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r2 = toBinary(2, 4); // Register r2
        var immediate = toBinary(baseAddress + 1, 8); // Address of 'buffer_screen'
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r2 + opcode);
    });
    (0, globals_1.test)('LDI using port clear_pixel', function () {
        var assembly = ['LDI r3 clear_pixel'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r3 = toBinary(3, 4); // Register r3
        var immediate = toBinary(baseAddress + 2, 8); // Address of 'clear_pixel'
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r3 + opcode);
    });
    (0, globals_1.test)('LDI using port draw_pixel', function () {
        var assembly = ['LDI r4 draw_pixel'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r4 = toBinary(4, 4); // Register r4
        var immediate = toBinary(baseAddress + 3, 8); // Address of 'draw_pixel'
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r4 + opcode);
    });
    (0, globals_1.test)('LDI using port pixel_x', function () {
        var assembly = ['LDI r5 pixel_x'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r5 = toBinary(5, 4); // Register r5
        var immediate = toBinary(baseAddress + 4, 8); // Address of 'pixel_x'
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r5 + opcode);
    });
    (0, globals_1.test)('LDI using port pixel_y', function () {
        var assembly = ['LDI r6 pixel_y'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r6 = toBinary(6, 4); // Register r6
        var immediate = toBinary(baseAddress + 5, 8); // Address of 'pixel_y'
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r6 + opcode);
    });
    (0, globals_1.test)('LDI using port number_display_low_8', function () {
        var assembly = ['LDI r7 number_display_low_8'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r7 = toBinary(7, 4); // Register r7
        var immediate = toBinary(baseAddress + 6, 8); // Address of 'number_display_low_8'
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r7 + opcode);
    });
    (0, globals_1.test)('LDI using port number_display_high8', function () {
        var assembly = ['LDI r8 number_display_high8'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var r8 = toBinary(8, 4); // Register r8
        var immediate = toBinary(baseAddress + 7, 8); // Address of 'number_display_high8'
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r8 + opcode);
    });
    (0, globals_1.test)('LDI using define and I/O port', function () {
        var assembly = [
            'DEFINE PORT pixel_x',
            'LDI r1 PORT'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var immediate = toBinary(246 + 4, 8); // Address of 'pixel_x' (base 246 + 4)
        var r1 = toBinary(1, 4); // Register r1
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r1 + opcode);
    });
    (0, globals_1.test)('LDI using define within define', function () {
        var assembly = [
            'DEFINE PORT pixel_x',
            'DEFINE PORT2 PORT',
            'LDI r1 PORT2'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LDI, 4);
        var immediate = toBinary(246 + 4, 8); // Address of 'pixel_x' (base 246 + 4)
        var r1 = toBinary(1, 4); // Register r1        
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r1 + opcode);
    });
    (0, globals_1.test)('ADI using define and I/O port (pixel_x)', function () {
        var assembly = [
            'DEFINE PORT pixel_x',
            'ADI r2 PORT'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADI, 4);
        var r2 = toBinary(2, 4); // Register r2
        var immediate = toBinary(246 + 4, 8); // Address of 'pixel_x' (base 246 + 4)
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r2 + opcode);
    });
    (0, globals_1.test)('ADI using define with I/O port (number_display_high8)', function () {
        var assembly = [
            'DEFINE PORT number_display_high8',
            'DEFINE PORT2 PORT',
            'ADI r3 PORT2'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADI, 4);
        var r3 = toBinary(3, 4); // Register r3
        var immediate = toBinary(246 + 7, 8); // Address of 'number_display_high8' (base 246 + 7)
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r3 + opcode);
    });
    (0, globals_1.test)('ADI using I/O port (number_display_high8)', function () {
        var assembly = [
            'ADI r3 number_display_high8'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADI, 4);
        var r3 = toBinary(3, 4); // Register r3
        var immediate = toBinary(246 + 7, 8); // Address of 'number_display_high8' (base 246 + 7)
        (0, globals_1.expect)(assembled[0]).toBe(immediate + r3 + opcode);
    });
    (0, globals_1.test)('ADD using define', function () {
        var assembly = [
            'DEFINE REG1 r4',
            'DEFINE REG2 r5',
            'DEFINE REG3 r6',
            'ADD REG1 REG2 REG3'
        ];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADD, 4);
        var reg4 = toBinary(registers.indexOf('r4'), 4); // REG1 resolves to r4
        var reg5 = toBinary(registers.indexOf('r5'), 4); // REG2 resolves to r5
        var reg6 = toBinary(registers.indexOf('r6'), 4); // REG3 resolves to r6
        (0, globals_1.expect)(assembled[0]).toBe(reg5 + reg6 + reg4 + opcode);
    });
    (0, globals_1.test)('JID with offset', function () {
        var assembly = ['JID r1 10'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.JID, 4);
        var reg = toBinary(1, 4);
        var immediate = toBinary(10, 8);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + reg + opcode);
    });
    (0, globals_1.test)('JID without offset', function () {
        var assembly = ['JID r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.JID, 4);
        var reg = toBinary(1, 4);
        var immediate = toBinary(0, 8);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + reg + opcode);
    });
    (0, globals_1.test)('ADC', function () {
        var assembly = ['ADC r3 r1 r2'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADC, 4);
        var reg3 = toBinary(3, 4);
        var reg2 = toBinary(2, 4);
        var reg1 = toBinary(1, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg1 + reg2 + reg3 + opcode);
    });
    (0, globals_1.test)('LOD with offset', function () {
        var assembly = ['LOD r2 r1 10'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LOD, 4);
        var reg1 = toBinary(1, 4);
        var reg2 = toBinary(2, 4);
        var offset = toBinary(10, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg1 + offset + reg2 + opcode);
    });
    (0, globals_1.test)('LOD without offset', function () {
        var assembly = ['LOD r2 r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.LOD, 4);
        var reg1 = toBinary(1, 4);
        var reg2 = toBinary(2, 4);
        var offset = toBinary(0, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg1 + offset + reg2 + opcode);
    });
    (0, globals_1.test)('STR with offset', function () {
        var assembly = ['STR r2 r1 10'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.STR, 4);
        var reg1 = toBinary(1, 4);
        var reg2 = toBinary(2, 4);
        var offset = toBinary(10, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg1 + offset + reg2 + opcode);
    });
    (0, globals_1.test)('STR without offset', function () {
        var assembly = ['STR r2 r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.STR, 4);
        var reg1 = toBinary(1, 4);
        var reg2 = toBinary(2, 4);
        var offset = toBinary(0, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg1 + offset + reg2 + opcode);
    });
    (0, globals_1.test)('CMP', function () {
        var assembly = ['CMP r1 r2'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.SUB, 4);
        var reg0 = toBinary(0, 4);
        var reg2 = toBinary(2, 4);
        var reg1 = toBinary(1, 4);
        (0, globals_1.expect)(reg1 + reg2 + reg0 + opcode);
    });
    (0, globals_1.test)('MOV', function () {
        var assembly = ['MOV r2 r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADD, 4);
        var reg2 = toBinary(2, 4);
        var reg1 = toBinary(1, 4);
        var reg0 = toBinary(0, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg1 + reg0 + reg2 + opcode);
    });
    (0, globals_1.test)('LSH', function () {
        var assembly = ['LSH r2 r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADD, 4);
        var reg2 = toBinary(2, 4);
        var reg1 = toBinary(1, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg1 + reg1 + reg2 + opcode);
    });
    (0, globals_1.test)('INC', function () {
        var assembly = ['INC r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADI, 4);
        var reg1 = toBinary(1, 4);
        var immediate = toBinary(1, 8);
        (0, globals_1.expect)(immediate + reg1 + opcode);
    });
    (0, globals_1.test)('DEC', function () {
        var assembly = ['DEC r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.ADI, 4);
        var reg1 = toBinary(1, 4);
        var immediate = toBinary(-1, 8);
        (0, globals_1.expect)(assembled[0]).toBe(immediate + reg1 + opcode);
    });
    (0, globals_1.test)('NOT', function () {
        var assembly = ['NOT r2 r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.NOR, 4);
        var reg2 = toBinary(2, 4);
        var reg0 = toBinary(0, 4);
        var reg1 = toBinary(1, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg1 + reg0 + reg2 + opcode);
    });
    (0, globals_1.test)('NEG', function () {
        var assembly = ['NEG r2 r1'];
        var assembled = assembler.assemble(assembly);
        var opcode = toBinary(cpu_1.Instructions.SUB, 4);
        var reg2 = toBinary(2, 4);
        var reg0 = toBinary(0, 4);
        var reg1 = toBinary(1, 4);
        (0, globals_1.expect)(assembled[0]).toBe(reg0 + reg1 + reg2 + opcode);
    });
});
(0, globals_1.describe)('Erros', function () {
    var assembler = new assembler_1.default();
    var registers = [
        'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7',
        'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15',
    ];
    (0, globals_1.test)('LDI error', function () {
        var assembly = ['LDI r'];
        var assembled = assembler.validateAssembly(assembly);
        console.log(assembled);
    });
});
var toBinary = function (value, nBits) {
    if (value < 0) {
        var twosComplement = (1 << nBits) + value;
        return twosComplement.toString(2).padStart(nBits, '0');
    }
    return value.toString(2).padStart(nBits, '0');
};
