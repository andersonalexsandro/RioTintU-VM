import { ProgramCounter } from '../src/programCounter';
import { describe, expect, test, beforeEach } from '@jest/globals';

describe('ProgramCounter', () => {
    let pc: ProgramCounter;

    beforeEach(() => {
        pc = new ProgramCounter(); // Inicializa o contador com o valor padrão (0)
    });

    test('should initialize with default value', () => {
        expect(pc.toString()).toBe('Program Counter: 0');
    });

    test('should initialize with a specified value', () => {
        pc = new ProgramCounter(10); // Inicializa com valor 10
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
