const readline = require('readline');
const { createMemory, createMemoryAbDv } = require('./create-memory');
const Instructions = require('./instructions');
const CPU = require('./cpu');
const concat4bits = require('./utils');
const Flags = require('./flags');
const MemoryMapper = require('./memory-mapper');
const Screen = require('./screen')

const [RAMab, RAM] = createMemoryAbDv(256);

const screen = new Screen(RAMab)
const charDisplay = new DataView(RAMab, 247, 3)
const numberDisplay = new DataView(RAMab, 250, 4)
const controller = new DataView(RAMab, 254, 2)

const memoryMapper = new MemoryMapper();

memoryMapper.map(screen,0b11110000, 0b11110110, true)
memoryMapper.map(charDisplay,0b11110111, 0b11111001, true)
memoryMapper.map(numberDisplay,0b11111010, 0b11111101, true)
memoryMapper.map(controller,11111110, 0b11111111, true)
memoryMapper.map(RAM, 0b00000000, 0b11101111, false);

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', () => {
    const halt = cpu.step();
    cpu.debug();
    cpu.viewNextInstruction();
    cpu.viewRAM(0b00000000);
    if (halt) {
        console.log("Program halted.");
        rl.close();
    }
});