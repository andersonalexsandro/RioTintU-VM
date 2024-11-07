const readline = require('readline');
const {createMemory, createMemoryAbDv} = require('./create-memory');
const Instructions = require('./instructions');
const CPU = require('./cpu');
const concat4bits = require('./utils');
const Flags = require('./flags');
const MemoryMapper = require('./memory-mapper')

const [RAMab, RAMdv] = createMemoryAbDv(256)

const mappedRAM = new MemoryMapper()
mappedRAM.map(RAMdv, 0b00000000, 0b11111111, false)



const ROM = createMemory(512);
const cpu = new CPU(mappedRAM, ROM);

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
    if (halt) {
        console.log("Program halted.");
        rl.close();
    }
});