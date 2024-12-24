import { expect, test, beforeEach } from '@jest/globals';
import Ram  from '../src/ram'

const length: number = 256
let ram: Ram;

beforeEach(() => {
    ram = new Ram(length);
});

test("should return the correct length in bytes", () => {
    expect(ram.getLengthInBytes()).toBe(length);
});

test('Verify set and get of every single Address', () => {
    for (let i = 0; i < length; i++) {
        ram.set(i, i);
        expect(ram.get(i)).toBe(i);
        
        ram.set(i, 0b11111111);
        expect(ram.get(i)).toBe(0b11111111);
    }
});

test('Test out of bounds', () => {
    expect(() => ram.set(256, 0b11111111)).toThrowError(); //ram goes from 0 until 255
    expect(() => ram.set(-1, 0b11111111)).toThrowError();
});