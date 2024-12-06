import {describe, expect, test, beforeEach} from '@jest/globals';
import Ram from '../src/ram';
import NumberDisplay from "../src/numberDisplay"

const initialAddress = 252;
const ramLength = 256;
let ram: Ram;
let numberDisplay: NumberDisplay;

beforeEach(() =>{
    ram = new Ram(ramLength);
    numberDisplay = new NumberDisplay(ram, initialAddress);
});

test("must share ram speace 252 and 253", () =>{
    for(let i=0; i<=255; i++){
        ram.setValue(252, i)
        expect(numberDisplay.getramAlocated().getUint8(0)).toBe(i)

        ram.setValue(253, i)
        expect(numberDisplay.getramAlocated().getUint8(1)).toBe(i)
    }
});

test("Display Number", () =>{
    // 16 Bit biggest number
    for(let i=0; i<=65536; i++){
        if(i < 256) numberDisplay.setValue(252, i);
        if(i >= 256) numberDisplay.setValue(253, i);
        expect(numberDisplay.toString()).toBe("Display: " + i);
    }
});