const readline = require('readline');
const { createMemory, createMemoryAbDv } = require('./create-memory');
const Instructions = require('./instructions');
const CPU = require('./cpu');
const concat4bits = require('./utils');
const Flags = require('./flags');
const MemoryMapper = require('./memory-mapper');
const Screen = require('./screen')
const NumberDisplay = require('./numberDisplay')

const [RAMab, RAM] = createMemoryAbDv(256);

const screen = new Screen(RAMab)
const numberDisplay = new NumberDisplay(RAMab)
const joystick = new DataView(RAMab, 254, 2)

const memoryMapper = new MemoryMapper();

memoryMapper.map(RAM, 0b00000000, 0b11110110, false)
memoryMapper.map(screen, 0b11110110, 0b11111011, true)
memoryMapper.map(numberDisplay, 0b11111100, 0b11111101, true)
memoryMapper.map(joystick, 0b11111110, 0b11111111, true)

const ROM = createMemory(512);
const cpu = new CPU(memoryMapper, ROM);


const writeBytes = new Uint8Array(ROM.buffer);

let i = 0;

writeBytes[i++] = concat4bits(0b1111, 0b1110); 
writeBytes[i++] = concat4bits(0b0001, Instructions.LDI); 
 
writeBytes[i++] = concat4bits(0b0000, 0b0001); 
writeBytes[i++] = concat4bits(0b0010, Instructions.LDI);

writeBytes[i++] = concat4bits(0b0001, 0b0010); 
writeBytes[i++] = concat4bits(0b0001, Instructions.ADD); 

writeBytes[i++] = concat4bits(0b0000, 0b0010); 
writeBytes[i++] = concat4bits(Flags.NOT_COUT, Instructions.BRH); 

writeBytes[i++] = concat4bits(0b0000, 0b0000); 
writeBytes[i++] = concat4bits(0b0010, Instructions.STR); 

writeBytes[i++] = concat4bits(0b0000, 0b0000); 
writeBytes[i++] = concat4bits(0b0000, Instructions.HLT); 

cpu.debug();
cpu.viewNextInstruction();
cpu.viewRAM(0b00000000, 1)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', () => {
    const halt = cpu.step();
    cpu.debug();
    cpu.viewRAM(0b00000000, 1)
    cpu.viewNextInstruction();
    cpu.viewRAM(0b00000000);
    if (halt) {
        console.log("Program halted.");
        rl.close();
    }
});