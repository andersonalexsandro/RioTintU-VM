const {createMemory} = require('./create-memory');
const Instructions = require('./instructions');
const Flags = require('./flags');
const concat4bits = require('./utils');

class CPU {
    constructor(RAM, ROM) {
        this.RAM = RAM;
        this.ROM = ROM;

        this.ZERO = true;
        this.COUT = false;
        this.MSB = false;
        this.EVEN = false;

        this.registerNames = [
            'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 
            'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'PC'
        ];

        this.registers = createMemory(this.registerNames.length);

        this.registerMap = this.registerNames.reduce((map, nameRegister, index) => {
            map[nameRegister] = index;
            return map;
        }, {});
    }

    debug() {
        this.registerNames.forEach(name => {
            const value = this.getRegister(name);
            console.log(`${name}: ${value.toString(2).padStart(8, '0')}`);
        });
        console.log();
    }

    viewRAM(address) {
        return console.log(this.RAM.getUint8(address).toString(2).padStart(8, '0') + "\n");
    }

    viewNextInstruction() {
        const nextInstructionAddress = this.getRegister('PC') * 2;
        const instruction = this.ROM.getUint16(nextInstructionAddress);
        const byte2 = ((instruction >> 8) & 0b11111111).toString(2).padStart(8, '0');
        const byte1 = (instruction & 0b11111111).toString(2).padStart(8, '0');
        console.log(`Program ROM - Byte 2: ${byte2}, Byte 1: ${byte1}`);
    }

    getRegister(name) {
        if (!(name in this.registerMap)) {
            throw new Error('getRegister: No Such Register ' + name);
        }
        return this.registers.getUint8(this.registerMap[name]);
    }

    setRegister(name, value) {
        if (!(name in this.registerMap)) {
            throw new Error('setRegister: No Such Register ' + name);
        }
        return this.registers.setUint8(this.registerMap[name], value);
    }

    fetch() {
        const nextInstructionAddress = this.getRegister('PC') * 2;
        const instruction = this.ROM.getUint16(nextInstructionAddress);
        this.setRegister('PC', this.getRegister('PC') + 1);
        return instruction;
    }

    execute(instruction) {
        const A = (instruction >> 12) & 0b1111; // Bits 15-12
        const B = (instruction >> 8) & 0b1111;  // Bits 11-8
        const C = (instruction >> 4) & 0b1111;  // Bits 7-4
        const OPCODE = instruction & 0b1111;    // Bits 3-0

        switch (OPCODE) {
            case Instructions.NOP: {
                return false;
            }

            case Instructions.HLT: {
                console.log("HLT encountered, stopping execution.");
                return true;
            }

            case Instructions.ADD: {
                const regA = this.registers.getUint8(A);
                const regB = this.registers.getUint8(B);
                const result = regA + regB;
                this.registers.setUint8(C, result);
                this.setFlag(result);
                return false;
            }

            case Instructions.SUB: {
                const regA = this.registers.getUint8(A);
                const regB = this.registers.getUint8(B);
                const negB = (~regB) + 1;
                const result = regA + negB;
                this.setFlag(result);
                this.registers.setUint8(C, result);
                return false;
            }

            case Instructions.NOR: {
                const regA = this.registers.getUint8(A);
                const regB = this.registers.getUint8(B);
                const result = ~(regA | regB);
                this.registers.setUint8(C, result);
                this.setFlag(result);
                return false;
            }

            case Instructions.AND: {
                const regA = this.registers.getUint8(A);
                const regB = this.registers.getUint8(B);
                const result = regA & regB;
                this.setFlag(result);
                this.registers.setUint8(C, result);
                return false;
            }

            case Instructions.XOR: {
                const regA = this.registers.getUint8(A);
                const regB = this.registers.getUint8(B);
                const result = regA ^ regB;
                this.setFlag(result);
                this.registers.setUint8(C, result);
                return false;
            }

            case Instructions.RSH: {
                const regA = this.registers.getUint8(A);
                const result = (regA >> 1);
                this.setFlag(result);
                if (regA % 2 !== 0) this.COUT = true;
                this.registers.setUint8(C, result);
                return false;
            }

            case Instructions.LDI: {
                const offset = concat4bits(A, B);
                this.registers.setUint8(C, offset);
                return false;
            }

            case Instructions.ADI: {
                const regC = this.registers.getUint8(C);
                const immediate = concat4bits(A, B);
                const result = regC + immediate;
                this.setFlag(result);
                this.registers.setUint8(C, result);
                return false;
            }

            case Instructions.BRH: {
                const flag = C & 0b0111;
                switch (flag) {
                    case Flags.NOT_EVEN: 
                        if (this.EVEN) return false;
                        break;
                    case Flags.EVEN:
                        if (!this.EVEN) return false;
                        break;
                    case Flags.ZERO:
                        if (!this.ZERO) return false;
                        break;
                    case Flags.NOT_ZERO:
                        if (this.ZERO) return false;
                        break;
                    case Flags.NOT_COUT:
                        if (this.COUT) return false;
                        break;
                    case Flags.COUT:
                        if (!this.COUT) return false;
                        break;
                    case Flags.NOT_MSB:
                        if (this.MSB) return false;
                        break;
                    case Flags.MSB:
                        if (!this.MSB) return false;
                        break;
                }
                const address = concat4bits(A, B);
                this.setRegister('PC', address);
                return false;
            }

            case Instructions.JMP: {
                const address = concat4bits(A, B);
                this.setRegister('PC', address);
                return false;
            }

            case Instructions.JID: {
                const offset = concat4bits(A, B);
                const regC = this.registers.getUint8(C);
                const result = regC + offset;
                this.setRegister('PC', result);
                return false;
            }

            case Instructions.ADC: {
                const regA = this.registers.getUint8(A);
                const regB = this.registers.getUint8(B);
                const cin = this.COUT ? 1 : 0;
                const result = regA + regB + cin;
                this.setFlag(result);
                this.registers.setUint8(C, result);
                return false;
            }

            case Instructions.LOD: {
                const regA = this.registers.getUint8(A);
                const address = regA + B;
                const ramValue = this.RAM.getUint8(address);
                this.registers.setUint8(C, ramValue);
                return false;
            }

            case Instructions.STR: {
                const regA = this.registers.getUint8(A);
                const address = regA + B;
                const regC = this.registers.getUint8(C);
                this.RAM.setUint8(address, regC);
                return false;
            }
        }
    }

    setFlag(result) {
        this.COUT = result > 0b11111111;
        this.ZERO = result === 0b00000000;
        this.EVEN = (result % 2) === 0;
        this.MSB = (result & 0b10000000) !== 0;
    }

    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
    
    run() {
        const halt = this.step();
        if (!halt) setImmediate(() => this.run());
    }
}

module.exports = CPU;