import { describe, expect, test } from '@jest/globals';
import Assembler from '../src/assembler/assembler';
import { Instructions } from '../src/cpu'; // Certifique-se de que `Instructions` contém todos os opcodes necessários.

describe('Assembler', () => {
    const assembler = new Assembler();
    const registers = [
        'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7',
        'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15',
    ];

    test('LDI r1 10', () => {
        const assembly = ['LDI r1 10'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const immediate = toBinary(10, 8);
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('LDI using define', () => {
        const assembly = [
            'DEFINE VALUE 42',
            'LDI r2 VALUE'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r2 = toBinary(registers.indexOf('r2'), 4);
        const immediate = toBinary(42, 8); // VALUE resolves to 42
        expect(assembled[0]).toBe(immediate + r2 + opcode);
    });

    test('ADD r4 r2 r3', () => {
        const assembly = ['ADD r4 r2 r3'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADD, 4);
        const r2 = toBinary(registers.indexOf('r2'), 4);
        const r3 = toBinary(registers.indexOf('r3'), 4);
        const r4 = toBinary(registers.indexOf('r4'), 4);
        expect(assembled[0]).toBe(r2 + r3 + r4 + opcode);
    });

    test('SUB r7 r5 r6', () => {
        const assembly = ['SUB r7 r5 r6'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.SUB, 4);
        const r5 = toBinary(registers.indexOf('r5'), 4);
        const r6 = toBinary(registers.indexOf('r6'), 4);
        const r7 = toBinary(registers.indexOf('r7'), 4);
        expect(assembled[0]).toBe(r5 + r6 + r7 + opcode);
    });

    test('XOR r10 r8 r9', () => {
        const assembly = ['XOR r10 r8 r9'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.XOR, 4);
        const r8 = toBinary(registers.indexOf('r8'), 4);
        const r9 = toBinary(registers.indexOf('r9'), 4);
        const r10 = toBinary(registers.indexOf('r10'), 4);
        expect(assembled[0]).toBe(r8 + r9 + r10 + opcode);
    });

    test('AND r13 r11 r12', () => {
        const assembly = ['AND r13 r11 r12'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.AND, 4);
        const r11 = toBinary(registers.indexOf('r11'), 4);
        const r12 = toBinary(registers.indexOf('r12'), 4);
        const r13 = toBinary(registers.indexOf('r13'), 4);
        expect(assembled[0]).toBe(r11 + r12 + r13 + opcode);
    });

    test('RSH r1 r2', () => {
        const assembly = ['RSH r1 r2'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.RSH, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const r2 = toBinary(registers.indexOf('r2'), 4);
        expect(assembled[0]).toBe(r2 + '0000' + r1 + opcode);
    });

    test('ADI r1 1', () => {
        const assembly = ['ADI r1 1'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADI, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const immediate = toBinary(1, 8);
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('ADI using define', () => {
        const assembly = [
            'DEFINE VALUE 20',
            'ADI r1 VALUE'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADI, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const immediate = toBinary(20, 8); // VALUE resolves to 20
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('JMP using immediate value', () => {
        const assembly = ['JMP 10'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.JMP, 4);
        const immediate = toBinary(10, 8); // Literal value 10
        expect(assembled[0]).toBe(immediate + '0000' + opcode);
    });
    
    test('JMP using label', () => {
        const assembly = ['.label', 'JMP .label'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.JMP, 4);
        const immediate = toBinary(0, 8); // `.label` resolves to address 0
        console.log(assembled);
        expect(assembled[0]).toBe(immediate + '0000' + opcode);
    });
    
    test('JMP using define', () => {
        const assembly = ['DEFINE CONST 15', 'JMP CONST'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.JMP, 4);
        const immediate = toBinary(15, 8); // Defined constant resolves to 15
        expect(assembled[0]).toBe(immediate + '0000' + opcode);
    });
});

const toBinary = (value: number, nBits: number): string => {
    if (value < 0) {
        const twosComplement = (1 << nBits) + value;
        return twosComplement.toString(2).padStart(nBits, '0');
    }
    return value.toString(2).padStart(nBits, '0');
};
