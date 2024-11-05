const createMemory = require('./create-memory');
const Instructions = require('./instructions');

class CPU {
    constructor(RAM, ROM) {
        this.RAM = RAM;
        this.ROM = ROM;
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
        console.log()
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

        switch(OPCODE) {

            case Instructions.NOP: {
                return
            }

            case Instructions.HLT: {
                return
            }

            case Instructions.ADD: {
                const regA = this.registers.getUint8(A);
                const regB = this.registers.getUint8(B);
                const result = regA + regB;
                this.registers.setUint8(C, result);
                return
            }

            case Instructions.SUB: {
                return
            }

            case Instructions.NOR: {
                return
            }

            case Instructions.AND: {
                return
            }

            case Instructions.XOR: {
                return
            }

            case Instructions.RSH: {
                return
            }

            case Instructions.LDI: {
                const offset = (A << 4) | B;
                this.registers.setUint8(C, offset)
                return
            }

            case Instructions.ADI: {
                return
            }
            case Instructions.JMP: {
                return
            }
            case Instructions.BRH: {
                return
            }
            case Instructions.JID: {
                return
            }
            case Instructions.ADC: {
                return
            }
            case Instructions.LOD: {
                return
            }
            case Instructions.STR: {
                return
            }

           
        }
    }

    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}

module.exports = CPU;