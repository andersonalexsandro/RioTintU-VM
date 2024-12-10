import {describe, expect, test, beforeEach} from '@jest/globals';
import ProgramRom16  from '../src/programRom'

const length: number = 512;
const romTotalAddresses = 256;
const initialProgramCounter = 0;
let pc: number;
let rom: ProgramRom16;

beforeEach(() => {
    rom = new ProgramRom16(length);
    pc = initialProgramCounter;
});

test("Set and Get next instruction", () => {
    for (let i=pc; i<romTotalAddresses; i++){
        //16 Bit highest number
        rom.set16(i, i)
        expect(rom.get16(i)).toBe(i)
    }
})

test("Set and Get High low Bits to next instruction", () => {
    for(let i=0; i<=65535; i++){
        let low = (i & 255);
        let high = (i >> 8 & 255);
        rom.setHighLowBits(255, high, low);
        expect(rom.get16(255)).toBe(i);
    }
})