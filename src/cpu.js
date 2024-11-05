const createMemory = require('./create-memory');

class CPU {

    constructor(RAM, ROM) {
        this.RAM = RAM
        this.ROM = ROM
        this.registerNames = [
            'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 
            'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'PC'
        ]
        this.registers = createMemory(this.registerNames.length);
        this.registerMap = this.registerNames.reduce((map, nameRegister, index) => {
            map[nameRegister] = index;
            return map;
        }, {})
    }

    getRegister(name) {
        if (!(name in this.registerMap)) {
            throw new Error('getRegister: No Such Register ' + name)
        }
        return this.registers.getUnit8(this.registerMap[name])
    }

    setRegister(name, value) {
        if (!(name in this.registerMap)) {
            throw new Error('setRegister: No Such Register ' + name)
        }
        return this.registers.setUnit8(this.registerMap[name], value)
    }
    
    fetch() {
        const nextInstructionAddress = this.getRegister('PC')
        const instruction = this.ROM.getUnit8(nextInstructionAddress);
        this.setRegister('PC', nextInstructionAddress + 1)
        return instruction
    }

    execute(instruction){
        switch(instruction) {

            //NOP - No Operation
            case 0b0000: {

            }

            //HLT - Halt CPU
            case 0b001: {

            }

            //ADD - Addition
            case 0b0010: {

            }

            //SUB - Subtraction
            case 0b0011: {

            }

            //NOR - Bitwise NOR
            case 0b0100: {

            }

            //AND - Bitwise AND

            //RSH - Right Shift

            //LDI - Load Immadiate

            //ADI - Add Immadiate

            //JMP - Jump

            //BRH - Branch

            //JID - Jumop-in-Diect Register

            //ADC - Add With Carry

            //LOD - Ram Memory Load

            //STR - Ram Memory Store
        }
    }
}

export default CPU;