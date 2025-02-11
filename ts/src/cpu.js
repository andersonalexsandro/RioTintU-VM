"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instructions = void 0;
var flags_1 = require("./flags");
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
var CPU = /** @class */ (function () {
    function CPU(memory, rom, registers, flags, pc) {
        this.memory = memory;
        this.rom = rom;
        this.registers = registers;
        this.flags = flags;
        this.pc = pc;
    }
    CPU.prototype.step = function () {
        var instruction = this.fetch();
        return this.execute(instruction);
    };
    CPU.prototype.run = function () {
        var _this = this;
        var halt = this.step();
        if (!halt)
            setImmediate(function () { return _this.run(); });
    };
    CPU.prototype.fetch = function () {
        var nexInstrucionAddress = (this.pc.getCounter());
        var instruction = this.rom.get16(nexInstrucionAddress);
        return instruction;
    };
    CPU.prototype.execute = function (instruction) {
        var _a = this.splitArgs(instruction), A = _a[0], B = _a[1], C = _a[2], OPCODE = _a[3];
        switch (OPCODE) {
            case Instructions.NOP:
                this.pc.incremment();
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
    };
    CPU.prototype.add = function (dest, A, B) {
        var regA = this.getRegContent(A);
        var regB = this.getRegContent(B);
        var result = regA + regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    };
    CPU.prototype.sub = function (dest, A, B) {
        var regA = this.getRegContent(A);
        var regB = this.getRegContent(B);
        var negativeB = (~regB) + 1;
        var result = regA + negativeB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    };
    CPU.prototype.nor = function (dest, A, B) {
        var regA = this.getRegContent(A);
        var regB = this.getRegContent(B);
        var result = ~(regA | regB);
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    };
    CPU.prototype.and = function (dest, A, B) {
        var regA = this.getRegContent(A);
        var regB = this.getRegContent(B);
        var result = regA & regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    };
    CPU.prototype.xor = function (dest, A, B) {
        var regA = this.getRegContent(A);
        var regB = this.getRegContent(B);
        var result = regA ^ regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    };
    CPU.prototype.rsh = function (dest, A) {
        var regA = this.getRegContent(A);
        var result = (regA >> 1);
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        if (regA % 2 !== 0)
            this.flags.setCout(true);
        this.pc.incremment();
    };
    CPU.prototype.ldi = function (dest, A, B) {
        var immediate = (A << 4) | B;
        this.setRegContent(dest, immediate);
        this.pc.incremment();
    };
    CPU.prototype.adi = function (C, A, B) {
        var immediate = (A << 4) | B;
        var regC = this.getRegContent(C);
        var result = regC + immediate;
        this.setRegContent(C, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    };
    CPU.prototype.brh = function (C, A, B) {
        var immediateJumpAddress = (A << 4) | B;
        var flag = C & 7;
        var doJump = false;
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
    };
    CPU.prototype.jmp = function (A, B) {
        var immediateJumpAddress = (A << 4) | B;
        this.pc.jump(immediateJumpAddress);
    };
    CPU.prototype.jid = function (C, A, B) {
        var regC = this.getRegContent(C);
        var immediate = (A << 4) | B;
        var resultAddress = regC + immediate;
        this.pc.jump(resultAddress);
    };
    CPU.prototype.adc = function (dest, A, B) {
        var regA = this.getRegContent(A);
        var regB = this.getRegContent(B);
        var result = regA + regB;
        this.flags.getCout() ? result++ : result;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    };
    CPU.prototype.lod = function (dest, A, offset) {
        var regA = this.getRegContent(A);
        var resultAddress = regA + offset;
        var memoryContent = this.memory.get(resultAddress);
        this.setRegContent(dest, memoryContent);
        this.pc.incremment();
    };
    CPU.prototype.str = function (C, A, offset) {
        var regA = this.getRegContent(A);
        var resultAddress = regA + offset;
        var regC = this.getRegContent(C);
        this.memory.set(resultAddress, regC);
        this.pc.incremment();
    };
    CPU.prototype.setRegContent = function (address, value) {
        this.registers.set(address, value);
    };
    CPU.prototype.getRegContent = function (address) {
        return this.registers.get(address);
    };
    CPU.prototype.splitArgs = function (instruction) {
        var A = (instruction >> 12) & 15; // Bits 15-12
        var B = (instruction >> 8) & 15; // Bits 11-8
        var C = (instruction >> 4) & 15; // Bits 7-4
        var OPCODE = instruction & 15; // Bits 3-0
        return [A, B, C, OPCODE];
    };
    return CPU;
}());
exports.default = CPU;
