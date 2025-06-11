// __tests__/validateAssembly.test.ts

import { describe, expect, test } from '@jest/globals';
import Assembler from '../src/assembler/assembler';

describe('validateAssembly', () => {
  test('no errors for completely valid assembly lines', () => {
    const assembler = new Assembler();
    const validLines = [
      'DEFINE CONST 10',
      '.start',
      'LDI r0 CONST',
      'ADI r1 5',
      'ADD r2 r3 r4',
      'SUB r5 r6 r7',
      'XOR r8 r9 r10',
      'AND r11 r12 r13',
      'RSH r1 r2',
      'JMP .start',
      'BRH >0 3',
      'JID r1 4',
      'JID r2',           // JID with 1 argument
      'LOD r2 r1 8',
      'LOD r3 r0',        // LOD without offset (2 arguments)
      'STR r3 r0 12',
      'STR r4 r1',        // STR without offset (2 arguments)
      'CMP r1 r2',
      'MOV r2 r1',
      'LSH r3 r2',
      'INC r4',
      'DEC r5',
      'NOT r6 r7',
      'NEG r7 r8',
      'HLT',
      'NOP'
    ];
    const errors = assembler.validateAssembly(validLines);
    expect(errors).toEqual([]);
  });

  test('reports invalid instruction name', () => {
    const assembler = new Assembler();
    const lines = [
      'FOO r1 r2 r3',   // unknown opcode
      'ldi r0 1',
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      line: 0,
      message: `Invalid instruction: "foo".`
    });
  });

  test('reports DEFINE with wrong number of tokens', () => {
    const assembler = new Assembler();
    const lines = [
      'DEFINE X',            // only 1 token after DEFINE
      'DEFINE A B C D',      // 3 tokens after DEFINE
      'LDI r0 1'
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toEqual({
      line: 0,
      message: `Invalid DEFINE syntax. Use: "DEFINE <SYMBOL> <VALUE>".`
    });
    expect(errors[1]).toEqual({
      line: 1,
      message: `Invalid DEFINE syntax. Use: "DEFINE <SYMBOL> <VALUE>".`
    });
  });

  test('reports DEFINE with invalid value', () => {
    const assembler = new Assembler();
    const lines = [
      'DEFINE X UNKNOWN_TOKEN',  // UNKNOWN_TOKEN is not numeric or defined
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      line: 0,
      message: `Invalid DEFINE value: "UNKNOWN_TOKEN".`
    });
  });

  test('reports invalid label syntax when extra tokens present', () => {
    const assembler = new Assembler();
    const lines = [
      '.loop extra',     // label must be alone
      'LDI r0 0'
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      line: 0,
      message: `Invalid label syntax. Labels must be on their own: ".loop extra".`
    });
  });

  test('reports incorrect argument count for various opcodes', () => {
    const assembler = new Assembler();
    const lines = [
      'ADD r1 r2',         // expects 3 args, got 2
      'SUB r3 r4 r5 r6',   // expects 3 args, got 4
      'LDI r0',            // expects 2 args, got 1
      'JMP',               // expects 1 arg, got 0
      'BRH >0',            // expects 2 args, got 1
      'INC',               // expects 1 arg, got 0
      'DEC r1 r2',         // expects 1 arg, got 2
      'NOT r1',            // expects 2 args, got 1
      'NEG r2 r3 extra',   // expects 2 args, got 3
      'JID'                // expects 1 or 2 args, got 0
    ];
    const errors = assembler.validateAssembly(lines);

    expect(errors).toHaveLength(lines.length);

    expect(errors[0]).toEqual({
      line: 0,
      message: `Instruction "add" expects 3 argument(s) but received 2.`
    });
    expect(errors[1]).toEqual({
      line: 1,
      message: `Instruction "sub" expects 3 argument(s) but received 4.`
    });
    expect(errors[2]).toEqual({
      line: 2,
      message: `Instruction "ldi" expects 2 argument(s) but received 1.`
    });
    expect(errors[3]).toEqual({
      line: 3,
      message: `Instruction "jmp" expects 1 argument(s) but received 0.`
    });
    expect(errors[4]).toEqual({
      line: 4,
      message: `Instruction "brh" expects 2 argument(s) but received 1.`
    });
    expect(errors[5]).toEqual({
      line: 5,
      message: `Instruction "inc" expects 1 argument(s) but received 0.`
    });
    expect(errors[6]).toEqual({
      line: 6,
      message: `Instruction "dec" expects 1 argument(s) but received 2.`
    });
    expect(errors[7]).toEqual({
      line: 7,
      message: `Instruction "not" expects 2 argument(s) but received 1.`
    });
    expect(errors[8]).toEqual({
      line: 8,
      message: `Instruction "neg" expects 2 argument(s) but received 3.`
    });
    expect(errors[9]).toEqual({
      line: 9,
      message: `Instruction "jid" expects 1 or 2 argument(s) but received 0.`
    });
  });

  test('reports invalid tokens for register, symbol, or number', () => {
    const assembler = new Assembler();
    const lines = [
      'ADD r1 foo r2',    // "foo" is not register/symbol/number
      'LDI r0 BAR',       // "BAR" not defined yet
      'BRH >0 BAZ',       // "BAZ" not numeric or symbol
      'JMP unknownLabel'  // "unknownLabel" not defined as a label
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(4);

    expect(errors[0]).toEqual({
      line: 0,
      message: `Invalid argument "foo" for instruction "add" (position 2).`
    });
    expect(errors[1]).toEqual({
      line: 1,
      message: `Invalid argument "bar" for instruction "ldi" (position 2).`
    });
    expect(errors[2]).toEqual({
      line: 2,
      message: `Invalid argument "baz" for instruction "brh" (position 2).`
    });
    expect(errors[3]).toEqual({
      line: 3,
      message: `Invalid argument "unknownlabel" for instruction "jmp" (position 1).`
    });
  });

  test('allows numeric literals and previously defined symbols', () => {
    const assembler = new Assembler();
    const lines = [
      'DEFINE X 7',
      'DEFINE Y X',
      'LDI r0 X',
      'ADI r1 Y',
      'ADD r2 r3 r4'
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toEqual([]);
  });
});
