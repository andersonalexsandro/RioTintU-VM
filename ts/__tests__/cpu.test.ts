import { describe, expect, test, beforeEach } from '@jest/globals';
import CPU, { Instructions } from '../src/cpu';
import Ram from '../src/ram';
import ProgramRom16 from '../src/programRom16';
import { Registers } from '../src/registers';
import { Flags } from '../src/flags';
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
        rom.setWithImmadiate(0, 155, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 155, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.SUB);

        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())
        cpu.execute(cpu.fetch())

        expect(registers.get(3)).toBe(0)
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
        rom.setWithImmadiate(0, 0b11111111, 1, Instructions.LDI);
        rom.setWithImmadiate(1, 0b00000001, 2, Instructions.LDI);
        rom.setPer4Bits(2, 1, 2, 3, Instructions.ADD);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(flags.getCout()).toBe(true);
        expect(flags.getEven()).toBe(true);
        expect(flags.getMsb()).toBe(false);
        expect(flags.getZero()).toBe(true);

        // ---------------------------------------------

        rom.setPer4Bits(3, 2, 1, 3, Instructions.SUB);
        cpu.execute(cpu.fetch());
        expect(registers.get(3)).toBe(2);

        expect(flags.getCout()).toBe(true);
        expect(flags.getEven()).toBe(true);
        expect(flags.getMsb()).toBe(false);
        expect(flags.getZero()).toBe(false);


        //------------------------------------------------

        rom.setWithImmadiate(4, 0b01111111, 1, Instructions.LDI);
        rom.setWithImmadiate(5, 0b00000001, 2, Instructions.LDI);
        rom.setPer4Bits(6, 2, 1, 3, Instructions.SUB);

        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());
        cpu.execute(cpu.fetch());

        expect(flags.getCout()).toBe(true);
        expect(flags.getEven()).toBe(true);
        expect(flags.getMsb()).toBe(true);
        expect(flags.getZero()).toBe(false);

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
});