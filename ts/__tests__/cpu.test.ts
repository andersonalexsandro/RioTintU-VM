import { describe, expect, test, beforeEach } from '@jest/globals';
import CPU, { Instructions } from '../src/cpu';
import Ram from '../src/ram';
import ProgramRom16 from '../src/programRom16';
import { Registers } from '../src/registers';
import { FlagCode, Flags } from '../src/flags';
import { ProgramCounter8 } from '../src/programCounter8';
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
    let pc: ProgramCounter8;
    let numberDisplay: NumberDisplay;
    let screen: Screen;
    let memoryMapper: MemoryMapper;

    beforeEach(() => {
        rom = new ProgramRom16(romLength);
        registers = new Registers(registersLength);
        registers.setRegisterNames(['r0', 'r1', 'r2', 'r3', 'r4', 'r5,', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'])
        flags = new Flags();
        pc = new ProgramCounter8();
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
        rom.setWithImmadiate(1, 155, 2, Instructions.ADD);

        expect(cpu.fetch()).toBe(rom.get16(0))
        pc.incremment();
        expect(cpu.fetch()).toBe(rom.get16(1))

    });

    test('Program Counter', () => {
        for(let i=0; i<255; i++){
            expect(pc.getCounter()).toBe(i);
            rom.setWithImmadiate(i, 0, 1, Instructions.LDI);
            cpu.execute(cpu.fetch());
        }
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
    });


    test('ADD', () =>{
        rom.setWithImmadiate(0, 100, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);

        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())

        expect(registers.get(3)).toBe(255)
    });

    test('SUB', () =>{
        rom.setWithImmadiate(0, 1, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 2, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.SUB);

        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())

        expect(registers.get(3)).toBe(0b11111111);
    });

    test('NOR', () =>{
        rom.setWithImmadiate(0, 0b10101010, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0b11100000, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.NOR);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(registers.get(3)).toBe(21);        
    });

    test('AND', () => {
        rom.setWithImmadiate(0, 0b10101010, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0b11100000, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.AND);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(registers.get(3)).toBe(0b10100000); 
    });

    test('XOR', () => {
        rom.setWithImmadiate(0, 0b10101010, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0b11100000, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.XOR);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(registers.get(3)).toBe(0b01001010); 
    });

    test('Flags', () => {
        // Test for the COUT (Carry Out) flag
        rom.setWithImmadiate(0, 0b11111111, 1, Instructions.LDI); // Load 255 into r1
        rom.setWithImmadiate(1, 0b00000001, 2, Instructions.LDI); // Load 1 into r2
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD); // r3 = r1 + r2
    
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
    
        expect(flags.getCout()).toBe(true); // There should be a carry out
        expect(flags.getEven()).toBe(true); // Result is even
        expect(flags.getMsb()).toBe(false); // MSB is not set
        expect(flags.getZero()).toBe(true); // Result is zero
    
        // ---------------------------------------------
    
        // Test for the ZERO flag
        rom.setWithImmadiate(3, 0b00000001, 1, Instructions.LDI); // Load 1 into r1
        rom.setWithImmadiate(4, 0b00000001, 2, Instructions.LDI); // Load 1 into r2
        rom.setPer4Bits(5, 1, 2, 3, Instructions.SUB); // r3 = r1 - r2
    
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
    
        expect(registers.get(3)).toBe(0); // r3 should be 0
        expect(flags.getCout()).toBe(false); // There should be no carry out
        expect(flags.getEven()).toBe(true); // Result is even
        expect(flags.getMsb()).toBe(false); // MSB is not set
        expect(flags.getZero()).toBe(true); // Result is zero
    
        // ---------------------------------------------
    
        // Test for the MSB (Most Significant Bit) flag
        rom.setWithImmadiate(6, 0b01111111, 1, Instructions.LDI); // Load 127 into r1
        rom.setWithImmadiate(7, 0b00000001, 2, Instructions.LDI); // Load 1 into r2
        rom.setPer4Bits(8, 1, 2, 3, Instructions.ADD); // r3 = r1 + r2
    
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
    
        expect(registers.get(3)).toBe(128); // r3 should be 128
        expect(flags.getCout()).toBe(false); // There should be no carry out
        expect(flags.getEven()).toBe(true); // Result is even
        expect(flags.getMsb()).toBe(true); // MSB is set
        expect(flags.getZero()).toBe(false); // Result is not zero
    
        // ---------------------------------------------
    
        // Test for the EVEN (Parity) flag
        rom.setWithImmadiate(9, 0b00000010, 1, Instructions.LDI); // Load 2 into r1
        rom.setWithImmadiate(10, 0b00000010, 2, Instructions.LDI); // Load 2 into r2
        rom.setPer4Bits(11, 1, 2, 3, Instructions.ADD); // r3 = r1 + r2
    
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
    
        expect(registers.get(3)).toBe(4); // r3 should be 4
        expect(flags.getCout()).toBe(false); // There should be no carry out
        expect(flags.getEven()).toBe(true); // Result is even
        expect(flags.getMsb()).toBe(false); // MSB is not set
        expect(flags.getZero()).toBe(false); // Result is not zero
    
        // ---------------------------------------------
    
        // Test for the NOT_EVEN (Odd) flag
        rom.setWithImmadiate(12, 0b00000001, 1, Instructions.LDI); // Load 1 into r1
        rom.setWithImmadiate(13, 0b00000010, 2, Instructions.LDI); // Load 2 into r2
        rom.setPer4Bits(14, 1, 2, 3, Instructions.ADD); // r3 = r1 + r2
    
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
    
        expect(registers.get(3)).toBe(3); // r3 should be 3
        expect(flags.getCout()).toBe(false); // There should be no carry out
        expect(flags.getEven()).toBe(false); // Result is odd
        expect(flags.getMsb()).toBe(false); // MSB is not set
        expect(flags.getZero()).toBe(false); // Result is not zero
    });

    test('RSH', () => {
        rom.setWithImmadiate(0, 0b10101010, 1, Instructions.LDI);
        rom.setPer4Bits(1, 1, 0, 2, Instructions.RSH);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(registers.get(2)).toBe(0b01010101)
    });

    test('ADI', () => {
        rom.setWithImmadiate(0, 0b10101010, 1, Instructions.ADI);
        rom.setWithImmadiate(1, 0b00000001, 1, Instructions.ADI);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(registers.get(1)).toBe(0b10101011);
    });

    test('JMP', () => {
        rom.setWithImmadiate(0, 255, 0, Instructions.JMP);
        rom.setWithImmadiate(255, 255, 1, Instructions.LDI);

        cpu.execute(cpu.fetch());
        expect(pc.getCounter()).toBe(255);

        cpu.execute(cpu.fetch());
        expect(registers.get(1)).toBe(255);
    });

    test('JID', () => {
        rom.setWithImmadiate(0, 1, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 254, 1, Instructions.JID);
        rom.setWithImmadiate(255, 255, 1, Instructions.LDI);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        expect(pc.getCounter()).toBe(255);

        cpu.execute(cpu.fetch());
        expect(registers.get(1)).toBe(255);
    });

    test('ADC', () => {
        rom.setWithImmadiate(0, 0b11111111, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0b00000001, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setPer4Bits(3, 1, 2, 3, Instructions.ADC);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(registers.get(3)).toBe(1);
    });

    test('STR', () => {
        rom.setWithImmadiate(0, 100, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, Instructions.LDI);
        rom.setPer4Bits(2, 2, 0, 1, Instructions.STR)

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(ram.get(1)).toBe(100);
    });

    test('LOD', () => {
        rom.setWithImmadiate(0, 100, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, Instructions.LDI);
        rom.setPer4Bits(2, 2, 0, 1, Instructions.STR)
        rom.setPer4Bits(3, 2, 0, 3, Instructions.LOD)

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(registers.get(3)).toBe(100);
    });

    test('LOD', () => {
        rom.setWithImmadiate(0, 100, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, Instructions.LDI);
        rom.setPer4Bits(2, 2, 0, 1, Instructions.STR)
        rom.setPer4Bits(3, 2, 0, 3, Instructions.LOD)

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(registers.get(3)).toBe(100);
    });

    test('BRH with COUT', () => {
        rom.setWithImmadiate(0, 255, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setWithImmadiate(3, 255, FlagCode.COUT, Instructions.BRH);
        
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(pc.getCounter()).toBe(255);
    });

    test('BRH with NOT_ZERO flag', () => {
        rom.setWithImmadiate(0, 1, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 1, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setWithImmadiate(3, 255, FlagCode.NOT_ZERO, Instructions.BRH);
        
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(pc.getCounter()).toBe(255);
    });

    test('BRH with ZERO flag', () => {
        rom.setWithImmadiate(0, 0, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setWithImmadiate(3, 255, FlagCode.ZERO, Instructions.BRH);
        
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(pc.getCounter()).toBe(255);
    });

    test('BRH with NOT_COUT flag', () => {
        rom.setWithImmadiate(0, 0, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setWithImmadiate(3, 255, FlagCode.NOT_COUT, Instructions.BRH);
        
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(pc.getCounter()).toBe(255);
    });

    test('BRH with MSB flag', () => {
        rom.setWithImmadiate(0, 0b10000000, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setWithImmadiate(3, 255, FlagCode.MSB, Instructions.BRH);
        
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(pc.getCounter()).toBe(255);
    });

    test('BRH with NOT_MSB flag', () => {
        rom.setWithImmadiate(0, 0b01111111, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setWithImmadiate(3, 255, FlagCode.NOT_MSB, Instructions.BRH);
        
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(pc.getCounter()).toBe(255);
    });

    test('BRH with EVEN flag', () => {
        rom.setWithImmadiate(0, 2, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 2, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setWithImmadiate(3, 255, FlagCode.EVEN, Instructions.BRH);
        
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(pc.getCounter()).toBe(255);
    });

    test('BRH with NOT_EVEN flag', () => {
        rom.setWithImmadiate(0, 1, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 2, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);
        rom.setWithImmadiate(3, 255, FlagCode.NOT_EVEN, Instructions.BRH);
        
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(pc.getCounter()).toBe(255);
    });
});