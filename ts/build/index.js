"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cpu_1 = __importStar(require("./cpu"));
const flags_1 = require("./flags");
const memoryMapper_1 = __importDefault(require("./memoryMapper"));
const numberDisplay_1 = __importDefault(require("./numberDisplay"));
const programCounter_1 = require("./programCounter");
const programRom16_1 = __importDefault(require("./programRom16"));
const ram_1 = __importDefault(require("./ram"));
const registers_1 = require("./registers");
const screen_1 = __importDefault(require("./screen"));
const ramLength = 256;
const screenStart = 246;
const screenWidth = 32;
const screenHeigth = 32;
const numberDisplayStart = 252;
const romLength = 512;
const registersLength = 16;
let cpu;
let ram;
let rom;
let registers;
let flags;
let pc;
let numberDisplay;
let screen;
let memoryMapper;
rom = new programRom16_1.default(romLength);
registers = new registers_1.Registers(registersLength);
registers.setRegisterNames(['r0', 'r1', 'r2', 'r3', 'r4', 'r5,', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15']);
flags = new flags_1.Flags();
pc = new programCounter_1.ProgramCounter();
ram = new ram_1.default(ramLength);
screen = new screen_1.default(ram, screenStart, screenWidth, screenHeigth);
numberDisplay = new numberDisplay_1.default(ram, numberDisplayStart);
memoryMapper = new memoryMapper_1.default();
memoryMapper.map(ram, 0, screenStart - 1, false);
memoryMapper.map(screen, screenStart, screenStart + screen_1.default.nBytesAlocated - 1, true);
memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + numberDisplay_1.default.nBytesAlocated - 1, true);
cpu = new cpu_1.default(memoryMapper, rom, registers, flags, pc);
rom.setPer4Bits(0, 0b1000, 0b0000, 0b0001, cpu_1.Instructions.LDI);
rom.setPer4Bits(1, 0b1000, 0b0000, 0b0010, cpu_1.Instructions.LDI);
rom.logPer4Bits(0);
rom.logPer4Bits(1);
cpu.fetch();
pc.incremment();
cpu.fetch();
