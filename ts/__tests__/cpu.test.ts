import { describe, expect, test, beforeEach } from '@jest/globals';
import CPU from '../src/cpu';
import Ram from '../src/ram';
import ProgramRom16 from '../src/programRom16';
import { Registers } from '../src/registers';
import { Flags } from '../src/flags';
import { ProgramCounter } from '../src/programCounter';
import NumberDisplay from '../src/numberDisplay';
import MemoryMapper from '../src/memoryMapper';
import Screen from '../src/screen';


describe('CPU', () =>{
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

    beforeEach(() =>{
        rom = new ProgramRom16(romLength);
        registers = new Registers(registersLength);
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

        test('fetch instructions', () =>{
        }
    }) 
})