const createMemory = require('./create-memory');
const CPU = require('./cpu');
const Instructions = require('./instructions');

const ROM = createMemory(512);
const writeBytes = new Uint8Array(ROM.buffer);

writeBytes[0] = concatenate4BitArrays(0b0000, 0b0001); 
 

writeBytes[2] = concatenate4BitArrays(0b0000, 0b0010); 
writeBytes[3] = concatenate4BitArrays(0b0010, Instructions.LDI);


writeBytes[4] = concatenate4BitArrays(0b0001, 0b0010); 
writeBytes[5] = concatenate4BitArrays(0b0011, Instructions.ADD); 

const cpu = new CPU(null, ROM);

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.debug()
cpu.step()

cpu.debug()

// console.log(writeBytes[0].toString(2).padStart(8, '0')); // Saída: 00000001
// console.log(writeBytes[1].toString(2).padStart(8, '0')); // Saída: 00011000

// console.log(writeBytes[2].toString(2).padStart(8, '0')); // Saída: 00011000
// console.log(writeBytes[3].toString(2).padStart(8, '0')); // Saída: 00011000

// console.log(writeBytes[4].toString(2).padStart(8, '0')); // Saída: 00011000
// console.log(writeBytes[5].toString(2).padStart(8, '0')); // Saída: 00011000


function concatenate4BitArrays(A, B) {
    if (A < 0 || A > 0b1111 || B < 0 || B > 0b1111) {
        throw new Error('Os valores devem ser de 4 bits (0 a 15)');
    }
    return (A << 4) | B;
}