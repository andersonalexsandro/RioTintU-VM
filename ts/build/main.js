import CPU from "./cpu.js";
import { Flags } from "./flags.js";
import MemoryMapper from "./memoryMapper.js";
import NumberDisplay from "./numberDisplay.js";
import { ProgramCounter8 } from "./programCounter8.js";
import ProgramRom16 from "./programRom16.js";
import Ram from "./ram.js";
import { Registers } from "./registers.js";
import Screen from "./screen.js";
import { Assembler } from "./assembler/assembler.js";
export function RioTintUInit() {
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
    const assembler = new Assembler();
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
