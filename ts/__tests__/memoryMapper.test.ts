import { expect, test, beforeEach } from '@jest/globals';
import Ram from '../src/ram';
import MemoryMapper from '../src/memoryMapper'
import Screen from '../src/screen';
import NumberDisplay from '../src/numberDisplay';

let memoryMapper: MemoryMapper;
let screen: Screen;
let numberDisplay: NumberDisplay;
let ram: Ram;

const ramLength = 256;

const screenStart = 246;
const screenWidth = 32;
const screenHeigth = 32;

const numberDisplayStart = 252


beforeEach(() =>{
    ram = new Ram(ramLength);
    screen = new Screen(ram, screenStart, screenWidth, screenHeigth);
    numberDisplay = new NumberDisplay(ram, numberDisplayStart);
    memoryMapper = new MemoryMapper();

    memoryMapper.map(ram, 0, ramLength - 1, false);
    memoryMapper.map(screen, screenStart, screenStart + Screen.nBytesAlocated - 1, true);
    memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + NumberDisplay.nBytesAlocated - 1, true); 
});

