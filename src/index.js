const readline = require('readline');
const createMemory = require('./create-memory');
const Instructions = require('./instructions');
const CPU = require('./cpu');
const concat4bits = require('./utils');
const Flags = require('./flags');

const ROM = createMemory(512);

const RAMab = new ArrayBuffer(256)
const RAM = new DataView(RAMab)

const cpu = new CPU(RAM, ROM);

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
    if (halt) {
        console.log("Program halted.");
        rl.close();
    }
});