const createMemory = require('./create-memory');
const Instructions = require('./instructions');
const CPU = require('./cpu');
const concat4bits = require('./utils')
const Flags = require('./flags')

const ROM = createMemory(512);
const writeBytes = new Uint8Array(ROM.buffer);

let i = 0

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

const RAM = createMemory(256)
const cpu = new CPU(RAM, ROM);

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.viewRAM(0b0000)

// console.log(writeBytes[0].toString(2).padStart(8, '0')); // Saída: 00000001
// console.log(writeBytes[1].toString(2).padStart(8, '0')); // Saída: 00011000

// console.log(writeBytes[2].toString(2).padStart(8, '0')); // Saída: 00011000
// console.log(writeBytes[3].toString(2).padStart(8, '0')); // Saída: 00011000

// console.log(writeBytes[4].toString(2).padStart(8, '0')); // Saída: 00011000
// console.log(writeBytes[5].toString(2).padStart(8, '0')); // Saída: 00011000