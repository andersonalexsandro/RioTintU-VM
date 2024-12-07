import {describe, expect, test, beforeEach} from '@jest/globals';
import Screen from '../src/screen'
import Ram from '../src/ram';
import { ReservedAddress } from '../src/screen';

const width = 32;
const height = 32;
const ramLength = 256;
const initialAddress = 246;
let ram: Ram;
let screen: Screen;

beforeEach(() =>{
    ram = new Ram(ramLength)
    screen = new Screen(ram, initialAddress, width, height);
});

test("get Height", () => {
    expect(screen.getHeight()).toBe(height)
});

test("get width", () => {
    expect(screen.getWidth()).toBe(width);
});

test("Verify nBytesAlocated and ramAlocatedSpace are the same ByteLength", () =>{
    expect(screen.getRamAlocatedSpace().byteLength).toBe(Screen.nBytesAlocated)
})

test("Screen Bytelength", () => {
    expect(screen.getScreen().byteLength).toBe(width * height)
})

test("Buffer Bytelength", () => {
    expect(screen.getScreen().byteLength).toBe(width * height)
})

test("Must share ram space from 246 until 251 inside ramAlocatedSpace", () => {
    for(let i=0; i<Screen.nBytesAlocated; i++){
        ram.set(initialAddress + i, 255) // 0b11111111
        expect(screen.getRamAlocatedSpace().getUint8(i)).toBe(255) // 0b11111111
    }
});

test("buffer content", () =>{
    for(let i=0; i< width * height - 1; i++){
        screen.getBuffer()[i] = 255;
        expect(screen.getBuffer()[i]).toBe(255);
    }
})

test("screen content", () =>{
    for(let i=0; i< width * height - 1; i++){
        screen.getScreen()[i] = 255;
        expect(screen.getScreen()[i]).toBe(255);
    }
})

test("X value", () =>{
    screen.set(ReservedAddress.PIXEL_X, 255);
    expect(screen.getX()).toBe(255);
})

test("Y value", () =>{
    screen.set(ReservedAddress.PIXEL_Y, 255);
    expect(screen.getY()).toBe(255);
})

test("Draw Pixel at Buffer", () =>{
    testItsClear();
    fulFillBuffer();
    for(let i=0; i < height; i++){
        for(let j=0; j<width; j++){
            expect(screen.getBuffer()[(i * width) + j]).toBe(255)
        }
    }
})

test("Clear Pixel at Buffer", () =>{
    fulFillBuffer();
    for(let i=0; i < height; i++){
        screen.set(ReservedAddress.PIXEL_Y, i);
        for(let j=0; j<width; j++){
            screen.set(ReservedAddress.PIXEL_X, j);
            screen.set(ReservedAddress.CLEAR_PIXEL);
        }
    }
    testItsClear();
})

test("Clear Buffer", () =>{
    fulFillBuffer();
    screen.set(ReservedAddress.CLEAR_SCREEN_BUFFER);
    testItsClear();
})

test("Push Buffer", () => {
    fulFillBuffer();
    screen.set(ReservedAddress.PUSH_SCREEN_BUFFER);
    for(let i=0; i< height; i++){
        for(let j=0; j<width; j++){
            expect(screen.getScreen()[(i * width) + j]).toBe(255);
        }
    }
});

test("Draw, Push, Clear, Push", () =>{
    testItsClear();
    for(let i=0; i < height; i++){
        screen.set(ReservedAddress.PIXEL_Y, i);
        for(let j=0; j<width; j++){
            screen.set(ReservedAddress.PIXEL_X, j);

            screen.set(ReservedAddress.DRAW_PIXEL);
            screen.set(ReservedAddress.PUSH_SCREEN_BUFFER);
            expect(screen.getScreen()[(i * width) + j]).toBe(255);
            
            screen.set(ReservedAddress.CLEAR_PIXEL);
            screen.set(ReservedAddress.PUSH_SCREEN_BUFFER);
            expect(screen.getScreen()[(i * width) + j]).toBe(0);
        }
    }
})

function testItsClear(){
    for(let i=0; i< height; i++){
        for(let j=0; j<width; j++){
            expect(screen.getBuffer()[(i * width) + j]).toBe(0);
        }
    }
};


function fulFillBuffer(){
    for(let i=0; i < height; i++){
        screen.set(ReservedAddress.PIXEL_Y, i);
        for(let j=0; j<width; j++){
            screen.set(ReservedAddress.PIXEL_X, j);
            screen.set(ReservedAddress.DRAW_PIXEL);
        }
    }
};


