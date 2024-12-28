import { ProgramCounter8 } from '../src/programCounter8';
import { describe, expect, test, beforeEach } from '@jest/globals';

describe('ProgramCounter8', () => {
    let pc: ProgramCounter8;

    beforeEach(() => {
        pc = new ProgramCounter8(); // Inicializa o contador com o valor padrão (0)
    });

    test('should initialize with default value', () => {
        expect(pc.toString()).toBe('Program Counter: 0');
    });

    test('should initialize with a specified value', () => {
        pc = new ProgramCounter8(10); // Inicializa com valor 10
        expect(pc.toString()).toBe('Program Counter: 10');
    });

    test('should jump to a specific address', () => {
        pc.jump(15);
        expect(pc.toString()).toBe('Program Counter: 15');
    });

    test('should increment the counter', () => {
        pc.incremment();
        expect(pc.toString()).toBe('Program Counter: 1');
        pc.incremment();
        expect(pc.toString()).toBe('Program Counter: 2');
    });

    test('should handle jump and increment combined', () => {
        pc.jump(100);
        expect(pc.toString()).toBe('Program Counter: 100');

        pc.incremment();
        expect(pc.toString()).toBe('Program Counter: 101');
    });
});
