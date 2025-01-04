import { describe, expect, test, beforeEach } from '@jest/globals';
import Assembler from '../src/assembler/assembler'
import { Instructions } from '../src/cpu';

describe('Assembler', () => {
    const assembler = new Assembler();
    const registers = ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15']

    test('LDI r1 10', () => {
        const assembly = ['LDI r1 10']
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const immediate = toBinary(10, 8)
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    })

    test('ADD r4 r2 r3', () => {
        const assembly = ['ADD r4 r2 r3']
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADD, 4);
        const r2 = toBinary(registers.indexOf('r2'), 4);
        const r3 = toBinary(registers.indexOf('r3'), 4);
        const r4 = toBinary(registers.indexOf('r4'), 4);
        expect(assembled[0]).toBe(r2 + r3 + r4 + opcode)
    })

    test('SUB r6 r4 r5', () => {
        const assembly = ['SUB r6 r4 r5']
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.SUB, 4);
        const r4 = toBinary(registers.indexOf('r4'), 4);
        const r5 = toBinary(registers.indexOf('r5'), 4);
        const r6 = toBinary(registers.indexOf('r6'), 4);
        expect(assembled[0]).toBe(r4 + r5 + r6 + opcode)
    })

})

const toBinary = (value: number, nBits: number): string => {
    return value.toString(2).padStart(nBits, '0')
}   