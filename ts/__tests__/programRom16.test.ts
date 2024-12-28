import { describe, expect, test, beforeEach } from '@jest/globals';
import ProgramRom16 from '../src/programRom16';
import { ProgramCounter8 as ProgramCounter8 } from '../src/programCounter8';
import { Instructions } from '../src/cpu';

const length: number = 512;
const romTotalAddresses = 256;
let pc: ProgramCounter8;
let rom: ProgramRom16;

describe('ProgramRom16', () => {
    beforeEach(() => {
        rom = new ProgramRom16(length);
        pc = new ProgramCounter8();
    });

    test('should set and get the next instruction correctly', () => {
        for (let i = 0; i < romTotalAddresses; i++) {
            rom.set16(pc.getCounter(), i);
            expect(rom.get16(i)).toBe(i);
            pc.incremment();
        }
    });

    test('should set and get high and low bits correctly', () => {
        for (let i = 0; i <= 65535; i++) {
            let low = (i & 255);
            let high = (i >> 8 & 255);
            rom.setHighLowBits(255, high, low);
            expect(rom.get16(255)).toBe(i);
        }
    });

    test('should set by 4 Bits', () => {
        for (let i = 0; i <= 65535; i++) {
            let bits4 = (i & 15);
            let bits3 = (i >> 4 & 15);
            let bits2 = (i >> 8 & 15);
            let bits1 = (i >> 12 & 15);
            rom.setPer4Bits(255, bits1, bits2, bits3, bits4);
            expect(rom.get16(255)).toBe(i);
        }
    });

    test('fetch instructions', () => {
        rom.setPer4Bits(0, 0, 1, 1, Instructions.LDI);
        expect(rom.stringPer4Bits(pc.getCounter())).toBe(`Address: 0, Bits: 0000 0001 0001 ${decToBin(Instructions.LDI)}`);
    });
});

export function decToBin(decimal: number, length: number = 4, spaceBetween: boolean = false): string {
    let binaryString = decimal.toString(2).padStart(length, '0');
    
    if (spaceBetween) {
        // Add spaces between each group of 4 bits
        binaryString = binaryString.padStart(Math.ceil(binaryString.length / 4) * 4, '0'); 
        binaryString = binaryString.match(/.{1,4}/g)?.join(' ') || binaryString;
    }
    
    return binaryString;
}