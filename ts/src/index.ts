import CPU, { Instructions } from "./cpu";
import { Flags } from "./flags";
import MemoryMapper from "./memoryMapper";
import NumberDisplay from "./numberDisplay";
import { ProgramCounter } from "./programCounter";
import ProgramRom16 from "./programRom16";
import Ram from "./ram";
import { Registers } from "./registers";
import Screen from "./screen";

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


rom.setWithImmadiate(0, 0b01111111, 1, Instructions.LDI);
rom.setWithImmadiate(1, 0b00000001, 2, Instructions.LDI);
rom.setPer4Bits(2, 2, 1, 3, Instructions.SUB);

cpu.execute(cpu.fetch());
cpu.execute(cpu.fetch());
cpu.execute(cpu.fetch());




