import { FlagCode, Flags } from "./flags";
import { ProgramCounter8 } from "./programCounter8";
import ProgramRom16 from "./programRom16";
import { Registers } from "./registers";

export enum Instructions {
    NOP = 0b0000,
    HLT = 0b0001,
    ADD = 0b0010,
    SUB = 0b0011,
    NOR = 0b0100,
    AND = 0b0101,
    XOR = 0b0110,
    RSH = 0b0111,
    LDI = 0b1000,
    ADI = 0b1001,
    JMP = 0b1010,
    BRH = 0b1011,
    JID = 0b1100,
    ADC = 0b1101,
    LOD = 0b1110,
    STR = 0b1111
}

export default class CPU {

    private memory: Memory;
    private rom: ProgramRom16;
    private registers: Registers;
    private flags: Flags;
    private pc: ProgramCounter8;

    constructor(memory: Memory, rom: ProgramRom16, registers: Registers, flags: Flags, pc: ProgramCounter8) {
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
        if (!halt) setImmediate(() => this.run());
    }

    public fetch(): number {
        const nexInstrucionAddress = (this.pc.getCounter());
        const instruction = this.rom.get16(nexInstrucionAddress);
        return instruction;
    }

    public execute(instruction: number) {
        const [A, B, C, OPCODE] = this.splitArgs(instruction);

        switch (OPCODE) {
            case Instructions.NOP:
                this.pc.incremment()
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

    private add(dest: number, A: number, B: number){
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const result = regA + regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }

    private sub(dest: number, A: number, B: number){
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const negativeB = (~regB) + 1;
        const result = regA + negativeB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }

    private nor(dest: number, A: number, B: number){
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const result = ~(regA | regB);
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }

    private and(dest: number, A: number, B: number){
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const result = regA & regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }

    private xor(dest: number, A: number, B: number){
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        const result = regA ^ regB;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }

    private rsh(dest: number, A: number){
        const regA = this.getRegContent(A);
        const result = (regA >> 1);
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        if(regA % 2 !== 0) this.flags.setCout(true);
        this.pc.incremment();
    }

    private ldi(dest: number, A: number, B: number){
        const immediate = (A << 4) | B;
        this.setRegContent(dest, immediate);
        this.pc.incremment();
    }

    private adi(C: number, A: number, B: number){
        const immediate = (A << 4) | B;
        const regC = this.getRegContent(C);
        const result = regC + immediate;
        this.setRegContent(C, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }

    private brh(C: number, A:number, B: number){
        const immediateJumpAddress = (A << 4) | B;
        const flag = C & 0b0111;
        let doJump = false;
        switch(flag) {
            case FlagCode.ZERO:
                doJump = this.flags.getZero();
                break;
            case FlagCode.NOT_ZERO:
                doJump = !this.flags.getZero();
                break;
            case FlagCode.COUT:
                doJump = this.flags.getCout();
                break;
            case FlagCode.NOT_COUT:
                doJump = !this.flags.getCout();
                break;
            case FlagCode.MSB:
                doJump = this.flags.getMsb();
                break;
            case FlagCode.NOT_MSB:
                doJump = !this.flags.getMsb();
                break;
            case FlagCode.EVEN:
                doJump = this.flags.getEven();
                break;
            case FlagCode.NOT_EVEN:
                doJump = !this.flags.getEven();
                break;
        }
        doJump ? this.pc.jump(immediateJumpAddress) : this.pc.incremment();
    }

    private jmp(A:number, B: number){
        const immediateJumpAddress = (A << 4) | B; 
        this.pc.jump(immediateJumpAddress);
    }

    private jid(C: number, A:number, B: number){
        const regC = this.getRegContent(C);
        const immediate = (A << 4) | B; 
        const resultAddress = regC + immediate;
        this.pc.jump(resultAddress);
    }

    private adc(dest: number, A:number, B: number){
        const regA = this.getRegContent(A);
        const regB = this.getRegContent(B);
        let result = regA + regB;
        this.flags.getCout() ? result++ : result;
        this.setRegContent(dest, result);
        this.flags.setFlags(result);
        this.pc.incremment();
    }

    private lod(dest: number, A: number, offset: number){
        const regA = this.getRegContent(A);
        const resultAddress = regA + offset;
        const memoryContent = this.memory.get(resultAddress);
        this.setRegContent(dest, memoryContent);
        this.pc.incremment();
    }

    private str(C: number, A: number, offset: number){
        const regA = this.getRegContent(A);
        const resultAddress = regA + offset;
        const regC = this.getRegContent(C);
        this.memory.set(resultAddress, regC);
        this.pc.incremment();
    }

    private setRegContent(address: number, value: number): void{
        this.registers.set(address, value);
    }

    private getRegContent(address: number){
        return this.registers.get(address)
    }

    private splitArgs(instruction: number): [number, number, number, number] {
        const A = (instruction >> 12) & 0b1111; // Bits 15-12
        const B = (instruction >> 8) & 0b1111;  // Bits 11-8
        const C = (instruction >> 4) & 0b1111;  // Bits 7-4
        const OPCODE = instruction & 0b1111;    // Bits 3-0
        return [A, B, C, OPCODE];
    }
}