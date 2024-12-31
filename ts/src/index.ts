import CPU, { Instructions } from "./cpu";
import { Flags } from "./flags";
import MemoryMapper from "./memoryMapper";
import NumberDisplay from "./numberDisplay";
import { ProgramCounter8 } from "./programCounter8";
import ProgramRom16 from "./programRom16";
import Ram from "./ram";
import { Registers } from "./registers";
import Screen from "./screen";
import { Assembler } from "./assembler/assembler";
import { FileManager } from "./assembler/fileManager";
import { NodeFileReader } from "./nodeFileReader";

export function RioTintUInit(fileManager: FileManager) {
    const ramLength = 256;
    const screenStart = 246;
    const screenWidth = 32;
    const screenHeigth = 32;
    const numberDisplayStart = 252;
    const romLength = 512;
    const registersLength = 16;
    
    const rom = new ProgramRom16(romLength);
    const registers = new Registers(registersLength);
    registers.setRegisterNames(['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15']);
    const flags = new Flags();
    const pc = new ProgramCounter8();
    const ram = new Ram(ramLength);
    const screen = new Screen(ram, screenStart, screenWidth, screenHeigth);
    const numberDisplay = new NumberDisplay(ram, numberDisplayStart);
    
    const memoryMapper = new MemoryMapper();
    memoryMapper.map(ram, 0, screenStart - 1, false);
    memoryMapper.map(screen, screenStart, screenStart + Screen.nBytesAlocated - 1, true);
    memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + NumberDisplay.nBytesAlocated - 1, true);
    
    const cpu = new CPU(memoryMapper, rom, registers, flags, pc);
    const assembler = new Assembler(fileManager);
    
    return {
        cpu,
        ram,
        rom,
        registers,
        flags,
        pc,
        numberDisplay,
        screen,
        memoryMapper,
        assembler
    };
}



export { CPU, ProgramRom16, Registers, Flags, ProgramCounter8, NumberDisplay, Screen, MemoryMapper, Assembler };

