import { describe, expect, test, beforeEach } from '@jest/globals';
import CPU, { Instructions } from '../src/cpu';
import Ram from '../src/ram';
import ProgramRom16 from '../src/programRom16';
import { Registers } from '../src/registers';
import { Flags } from '../src/flags';
import { ProgramCounter } from '../src/programCounter';
import NumberDisplay from '../src/numberDisplay';
import MemoryMapper from '../src/memoryMapper';
import Screen from '../src/screen';

describe('CPU', () => {
    const ramLength = 256;
    const screenStart = 246;
    const screenWidth = 32;
    const screenHeigth = 32;
    const numberDisplayStart = 252;
    const romLength = 512;
    const registersLength = 16;

    let cpu: CPU;
    let ram: Ram;
    let rom: ProgramRom16;
    let registers: Registers;
    let flags: Flags;
    let pc: ProgramCounter;
    let numberDisplay: NumberDisplay;
    let screen: Screen;
    let memoryMapper: MemoryMapper;

    beforeEach(() => {
        rom = new ProgramRom16(romLength);
        registers = new Registers(registersLength);
        registers.setRegisterNames(['r0', 'r1', 'r2', 'r3', 'r4', 'r5,', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'])
        flags = new Flags();
        pc = new ProgramCounter();
        ram = new Ram(ramLength);
    
        screen = new Screen(ram, screenStart, screenWidth, screenHeigth);
        numberDisplay = new NumberDisplay(ram, numberDisplayStart);
        
        memoryMapper = new MemoryMapper();
        memoryMapper.map(ram, 0, screenStart - 1, false);
        memoryMapper.map(screen, screenStart, screenStart + Screen.nBytesAlocated - 1, true);
        memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + NumberDisplay.nBytesAlocated - 1, true);
        
        cpu = new CPU(memoryMapper, rom, registers, flags, pc);
    });

    test('fetch instructions', () => {
        rom.setWithImmadiate(0, 100, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, Instructions.LDI);

        expect(cpu.fetch()).toBe(rom.get16(0))
        pc.incremment();
        expect(cpu.fetch()).toBe(rom.get16(1))

    });

    test('LDI', () =>{     
        rom.setWithImmadiate(0, 100, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, Instructions.LDI);

        cpu.execute(cpu.fetch());
        expect(pc.getCounter()).toBe(1);

        cpu.execute(cpu.fetch());
        expect(pc.getCounter()).toBe(2);

        registers.toString();
        expect(registers.get(1)).toBe(100)
        expect(registers.get(2)).toBe(155)
    })


    test('ADD', () =>{
        rom.setWithImmadiate(0, 100, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);

        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())

        expect(registers.get(3)).toBe(255)
    })

    test('SUB', () =>{
        rom.setWithImmadiate(0, 155, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.SUB);

        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())

        expect(registers.get(3)).toBe(0)
    })
});

function stringPer4Bits(value: number): string {
    const bits4_1 = ((value >> 12) & 0b1111).toString(2).padStart(4, '0'); // Bits 15-12 -> A
    const bits4_2 = ((value >> 8) & 0b1111).toString(2).padStart(4, '0');  // Bits 11-8  -> B
    const bits4_3 = ((value >> 4) & 0b1111).toString(2).padStart(4, '0');  // Bits 7-4   -> C
    const bits4_4 = (value & 0b1111).toString(2).padStart(4, '0');         // Bits 3-0   -> OPCODE
    return `Bits: ${bits4_1} ${bits4_2} ${bits4_3} ${bits4_4}`;
}