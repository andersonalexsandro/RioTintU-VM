"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instructions = void 0;
const flags_1 = require("./flags");
var Instructions;
(function (Instructions) {
    Instructions[Instructions["NOP"] = 0] = "NOP";
    Instructions[Instructions["HLT"] = 1] = "HLT";
    Instructions[Instructions["ADD"] = 2] = "ADD";
    Instructions[Instructions["SUB"] = 3] = "SUB";
    Instructions[Instructions["NOR"] = 4] = "NOR";
    Instructions[Instructions["AND"] = 5] = "AND";
    Instructions[Instructions["XOR"] = 6] = "XOR";
    Instructions[Instructions["RSH"] = 7] = "RSH";
    Instructions[Instructions["LDI"] = 8] = "LDI";
    Instructions[Instructions["ADI"] = 9] = "ADI";
    Instructions[Instructions["JMP"] = 10] = "JMP";
    Instructions[Instructions["BRH"] = 11] = "BRH";
    Instructions[Instructions["JID"] = 12] = "JID";
    Instructions[Instructions["ADC"] = 13] = "ADC";
    Instructions[Instructions["LOD"] = 14] = "LOD";
    Instructions[Instructions["STR"] = 15] = "STR";
})(Instructions || (exports.Instructions = Instructions = {}));
class CPU {
    constructor(memory, rom, registers, flags, pc) {
        this.memory = memory;
        this.rom = rom;
        this.registers = registers;
        this.flags = flags;
        this.pc = pc;
    }
    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
    run() {
        const halt = this.step();
        if (!halt)
            setImmediate(() => this.run());
    }
    fetch() {
        const nexInstrucionAddress = (this.pc.getCounter());
        const instruction = this.rom.get16(nexInstrucionAddress);
        return instruction;
    }
    execute(instruction) {
        const [A, B, C, OPCODE] = this.splitArgs(instruction);
        switch (OPCODE) {
            case Instructions.NOP:
                break;
            case Instructions.HLT:
                return true;
            case Instructions.ADD:
                this.add(C, A, B);
                break;
            case Instructions.SUB:
                this.sub(C, A, B);
                break;
            case Instructions.NOR:
                this.nor(C, A, B);
                break;
            case Instructions.AND:
                this.and(C, A, B);
                break;
            case Instructions.XOR:
                this.xor(C, A, B);
                break;
            case Instructions.RSH:
                this.rsh(C, A);
                break;
            case Instructions.LDI:
                this.ldi(C, A, B);
                break;
            case Instructions.ADI:
                this.adi(C, A, B);
                break;
            case Instructions.BRH:
                this.brh(C, A, B);
                break;
            case Instructions.JMP:
                this.jmp(A, B);
                break;
            case Instructions.JID:
                this.jid(C, A, B);
                break;
            case Instructions.ADC:
                this.adc(C, A, B);
                break;
            case Instructions.LOD:
                this.lod(C, A, B);
                break;
            case Instructions.STR:
                this.str(C, A, B);
                break;
            default:
                return false;
        }
    }
    add(dest, A, B) {
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const result = regA + regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }
    sub(dest, A, B) {
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const negativeB = (~regB) + 1;
        const result = regA + negativeB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }
    nor(dest, A, B) {
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const result = ~(regA | regB);
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }
    and(dest, A, B) {
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const result = regA & regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }
    xor(dest, A, B) {
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const result = regA ^ regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }
    rsh(dest, A) {
        const regA = this.getRegContent(A);
        const result = (regA >> 1);
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        if (regA % 2 !== 0)
            this.flags.setCout(true);
        this.pc.incremment();
    }
    ldi(dest, A, B) {
        const immediate = (A << 4) | B;
        this.setRegContent(dest, immediate);
        this.pc.incremment();
    }
    adi(C, A, B) {
        const immediate = (A << 4) | B;
        const regC = this.getRegContent(C);
        const result = regC + immediate;
        this.setRegContent(C, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }
    brh(C, A, B) {
        const immediateJumpAddress = (A << 4) | B;
        const flag = C & 0b0111;
        let doJump = false;
        switch (flag) {
            case flags_1.FlagCode.ZERO:
                doJump = this.flags.getZero();
                break;
            case flags_1.FlagCode.NOT_ZERO:
                doJump = !this.flags.getZero();
                break;
            case flags_1.FlagCode.COUT:
                doJump = this.flags.getCout();
                break;
            case flags_1.FlagCode.NOT_COUT:
                doJump = !this.flags.getCout();
                break;
            case flags_1.FlagCode.MSB:
                doJump = this.flags.getMsb();
                break;
            case flags_1.FlagCode.NOT_MSB:
                doJump = !this.flags.getMsb();
                break;
            case flags_1.FlagCode.EVEN:
                doJump = this.flags.getEven();
                break;
            case flags_1.FlagCode.NOT_EVEN:
                doJump = !this.flags.getEven();
                break;
        }
        doJump ? this.pc.jump(immediateJumpAddress) : this.pc.incremment();
    }
    jmp(A, B) {
        const immediateJumpAddress = (A << 4) | B;
        this.pc.jump(immediateJumpAddress);
    }
    jid(C, A, B) {
        const regC = this.getRegContent(C);
        const immediate = (A << 4) | B;
        const resultAddress = regC + immediate;
        this.pc.jump(resultAddress);
    }
    adc(dest, A, B) {
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        let result = regA + regB;
        this.flags.getCout() ? result++ : result;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }
    lod(dest, A, offset) {
        const regA = this.getRegContent(A);
        const resultAddress = regA + offset;
        const memoryContent = this.memory.get(resultAddress);
        this.setRegContent(dest, memoryContent);
        this.pc.incremment();
    }
    str(C, A, offset) {
        const regA = this.getRegContent(A);
        const resultAddress = regA + offset;
        const regC = this.getRegContent(C);
        this.memory.set(resultAddress, regC);
        this.pc.incremment();
    }
    setRegContent(address, value) {
        this.registers.set(address, value);
    }
    getRegContent(address) {
        return this.registers.get(address);
    }
    splitArgs(instruction) {
        const A = (instruction >> 12) & 0b1111; // Bits 15-12
        const B = (instruction >> 8) & 0b1111; // Bits 11-8
        const C = (instruction >> 4) & 0b1111; // Bits 7-4
        const OPCODE = instruction & 0b1111; // Bits 3-0
        return [A, B, C, OPCODE];
    }
}
exports.default = CPU;
