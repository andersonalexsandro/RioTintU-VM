// __tests__/validateAssembly.test.ts

import { describe, expect, test } from '@jest/globals';
import Assembler from '../src/assembler/assembler';

describe('validateAssembly', () => {
  test('no errors for completamente valid assembly lines', () => {
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
      'JID r2',           // JID com 1 argumento
      'LOD r2 r1 8',
      'LOD r3 r0',        // LOD sem offset (2 argumentos)
      'STR r3 r0 12',
      'STR r4 r1',        // STR sem offset (2 argumentos)
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
      'FOO r1 r2 r3',   // opcode desconhecido
      'ldi r0 1',
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      line: 0,
      message: `Invalid instruction: "foo".`
    });
  });

  test('reports DEFINE com número errado de tokens', () => {
    const assembler = new Assembler();
    const lines = [
      'DEFINE X',            // apenas 1 token após DEFINE
      'DEFINE A B C D',      // 3 tokens após DEFINE
      'LDI r0 1'
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toEqual({
      line: 0,
      message: `DEFINE syntax inválido. Use: "DEFINE <SIMBOLO> <VALOR>".`
    });
    expect(errors[1]).toEqual({
      line: 1,
      message: `DEFINE syntax inválido. Use: "DEFINE <SIMBOLO> <VALOR>".`
    });
  });

  test('reports DEFINE com valor inválido', () => {
    const assembler = new Assembler();
    const lines = [
      'DEFINE X UNKNOWN_TOKEN',  // UNKNOWN_TOKEN não é numérico nem definido
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      line: 0,
      message: `DEFINE valor inválido: "UNKNOWN_TOKEN".`
    });
  });

  test('reports label com sintaxe inválida quando possui tokens extras', () => {
    const assembler = new Assembler();
    const lines = [
      '.loop extra',     // rótulo não deve ter nada além do nome
      'LDI r0 0'
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      line: 0,
      message: `Invalid label syntax. Labels devem estar sozinhos: ".loop extra".`
    });
  });

  test('reports contagem de argumentos incorreta para vários opcodes', () => {
    const assembler = new Assembler();
    const lines = [
      'ADD r1 r2',         // espera 3 args, recebeu 2
      'SUB r3 r4 r5 r6',   // espera 3 args, recebeu 4
      'LDI r0',            // espera 2 args, recebeu 1
      'JMP',               // espera 1 arg, recebeu 0
      'BRH >0',            // espera 2 args, recebeu 1
      'INC',               // espera 1 arg, recebeu 0
      'DEC r1 r2',         // espera 1 arg, recebeu 2
      'NOT r1',            // espera 2 args, recebeu 1
      'NEG r2 r3 extra',   // espera 2 args, recebeu 3
      'JID'                // espera 1 ou 2 args, recebeu 0
    ];
    const errors = assembler.validateAssembly(lines);

    expect(errors).toHaveLength(lines.length);

    expect(errors[0]).toEqual({
      line: 0,
      message: `Instruction "add" espera 3 argumento(s) mas recebeu 2.`
    });
    expect(errors[1]).toEqual({
      line: 1,
      message: `Instruction "sub" espera 3 argumento(s) mas recebeu 4.`
    });
    expect(errors[2]).toEqual({
      line: 2,
      message: `Instruction "ldi" espera 2 argumento(s) mas recebeu 1.`
    });
    expect(errors[3]).toEqual({
      line: 3,
      message: `Instruction "jmp" espera 1 argumento(s) mas recebeu 0.`
    });
    expect(errors[4]).toEqual({
      line: 4,
      message: `Instruction "brh" espera 2 argumento(s) mas recebeu 1.`
    });
    expect(errors[5]).toEqual({
      line: 5,
      message: `Instruction "inc" espera 1 argumento(s) mas recebeu 0.`
    });
    expect(errors[6]).toEqual({
      line: 6,
      message: `Instruction "dec" espera 1 argumento(s) mas recebeu 2.`
    });
    expect(errors[7]).toEqual({
      line: 7,
      message: `Instruction "not" espera 2 argumento(s) mas recebeu 1.`
    });
    expect(errors[8]).toEqual({
      line: 8,
      message: `Instruction "neg" espera 2 argumento(s) mas recebeu 3.`
    });
    expect(errors[9]).toEqual({
      line: 9,
      message: `Instruction "jid" espera 1 ou 2 argumento(s) mas recebeu 0.`
    });
  });

  test('reports tokens inválidos para registrador, símbolo ou número', () => {
    const assembler = new Assembler();
    const lines = [
      'ADD r1 foo r2',    // "foo" não é registrador/símbolo/número
      'LDI r0 BAR',       // "BAR" ainda não definido
      'BRH >0 BAZ',       // "BAZ" não é numérico ou símbolo
      'JMP unknownLabel'  // "unknownLabel" não foi definido como label
    ];
    const errors = assembler.validateAssembly(lines);
    expect(errors).toHaveLength(4);

    expect(errors[0]).toEqual({
      line: 0,
      message: `Argumento inválido "foo" para instrução "add" (posição 2).`
    });
    expect(errors[1]).toEqual({
      line: 1,
      message: `Argumento inválido "bar" para instrução "ldi" (posição 2).`
    });
    expect(errors[2]).toEqual({
      line: 2,
      message: `Argumento inválido "baz" para instrução "brh" (posição 2).`
    });
    expect(errors[3]).toEqual({
      line: 3,
      message: `Argumento inválido "unknownlabel" para instrução "jmp" (posição 1).`
    });
  });

  test('allows numeric literals e símbolos definidos anteriormente', () => {
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
