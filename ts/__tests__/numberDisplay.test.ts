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