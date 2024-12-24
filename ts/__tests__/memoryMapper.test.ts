import { expect, test, beforeEach } from '@jest/globals';
import Ram from '../src/ram';
import MemoryMapper from '../src/memoryMapper';
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

    memoryMapper.map(ram, 0, screenStart - 1, false);
    memoryMapper.map(screen, screenStart, screenStart + Screen.nBytesAlocated - 1, true);
    memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + NumberDisplay.nBytesAlocated - 1, true); 
});

test("Range for each Device", () => {
    let region = memoryMapper.findRegion(0);
    expect(region.device instanceof Ram);
    expect(region.start).toBe(0);
    expect(region.end).toBe(screenStart - 1);

    region = memoryMapper.findRegion(screenStart);
    expect(region.device instanceof Screen);
    expect(region.start).toBe(screenStart);
    expect(region.end).toBe(numberDisplayStart - 1);

    region = memoryMapper.findRegion(numberDisplayStart);
    expect(region.device instanceof NumberDisplay);
    expect(region.start).toBe(numberDisplayStart);
    expect(region.end).toBe(numberDisplayStart + NumberDisplay.nBytesAlocated - 1);
});

test("Get each device", () => {

    for (let i = 0; i < numberDisplayStart + NumberDisplay.nBytesAlocated; i++) {

        const region = memoryMapper.findRegion(i);

        if (i > 0 && i < screenStart) {
            expect(region.device instanceof Ram).toBe(true);
        }

        if(i >= screenStart && i < Screen.nBytesAlocated + screenStart){
            expect(region.device instanceof Screen);
        }

        if (i >= Screen.nBytesAlocated + screenStart && i < numberDisplayStart){
            expect(region.device instanceof NumberDisplay)
        }
    }
});
