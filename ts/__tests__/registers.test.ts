import { Registers } from '../src/registers';
import { describe, expect, test, beforeEach, it } from '@jest/globals';

describe('Registers', () => {
  let registers: Registers;

  beforeEach(() => {
    // Inicializando registradores de r0 a r15
    const registerNames = Array.from({ length: 16 }, (_, i) => `r${i}`);
    registers = new Registers(16);
    registers.setRegisterNames(registerNames);
  });

  it('should initialize all registers to 0', () => {
    expect(registers.toString()).toBe(
      Array.from({ length: 16 }, (_, i) => `r${i}: 0`).join(', ')
    );
  });

  it('should set and get values by address', () => {
    registers.set(2, 42);
    registers.set(1, 84);
    registers.set(15, 126);

    expect(registers.get(2)).toBe(42);
    expect(registers.get(1)).toBe(84);
    expect(registers.get(15)).toBe(126);
  });

  it('should set and get values by name', () => {
    registers.set(1, 99);
    expect(registers.getByName('r1')).toBe(99);

    registers.set(1, 123);
    expect(registers.getByName('r1')).toBe(123);

    registers.set(15, 77);
    expect(registers.getByName('r15')).toBe(77);
  });

  it('should throw error for invalid address', () => {
    expect(() => registers.get(100)).toThrowError();
  });
});
