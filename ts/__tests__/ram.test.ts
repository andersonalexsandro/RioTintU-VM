
import {describe, expect, test, beforeEach} from '@jest/globals';
import Ram from "../src/ram";

let length: number; // Ram Length in bytes
let ram: Ram;

beforeEach(() => {
    length = 256;
    ram = new Ram(length);
});

test("should return the correct length in bytes", () => {
    expect(ram.getLengthInBytes()).toBe(length);
});

test('Verify set and get of every single Address', () => {
    for (let i = 0; i < length; i++) {
        ram.setValue(i, i);
        expect(ram.getValue(i)).toBe(i);
    }
});