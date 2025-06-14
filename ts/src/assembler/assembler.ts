interface ErrorInfo {
  line: number;
  message: string;
}

export class Assembler {
  private opcodes = [
    'nop', 'hlt', 'add', 'sub',
    'nor', 'and', 'xor', 'rsh',
    'ldi', 'adi', 'jmp', 'brh', 
    'jid', 'adc', 'lod', 'str',
    'cmp', 'mov', 'neg', 'not',
    'inc', 'dec', 'lsh'
  ];

  private registers = [
    'r0', 'r1', 'r2', 'r3',
    'r4', 'r5', 'r6', 'r7',
    'r8', 'r9', 'r10', 'r11',
    'r12', 'r13', 'r14', 'r15'
  ];

  private conditions1 = ['pos', 'neg', 'lt', 'ge', 'eq', 'ne', 'odd', 'even'];
  private conditions2 = ['>0', '<0', '<', '>=', '=', '!=', '!%2', '%2'];
  private conditions4 = ['notmsb', 'msb', 'notcarry', 'carry', 'zero', 'notzero', 'noteven', 'even'];

  private ports = [
    'clear_sreen_buffer', 'buffer_screen', 'clear_pixel', 'draw_pixel',
    'pixel_x', 'pixel_y', 'number_display_low_8', 'number_display_high_8'
  ];

  private labels = new Map<string, number>();
  private symbols = new Map<string, number>();

  constructor() {
    this.initializeSymbols();
  }

  private initializeSymbols() {
    for (const [index, symbol] of this.registers.entries()) {
      this.symbols.set(symbol, index);
    }

    for (const [index, symbol] of this.opcodes.entries()) {
      this.symbols.set(symbol, index);
    }

    for (const [index, symbol] of this.conditions1.entries()) {
      this.symbols.set(symbol, index);
    }

    for (const [index, symbol] of this.conditions2.entries()) {
      this.symbols.set(symbol, index);
    }

    for (const [index, symbol] of this.conditions4.entries()) {
      this.symbols.set(symbol, index);
    }

    for (const [index, symbol] of this.ports.entries()) {
      this.symbols.set(symbol, index + 246);
    }
  }

  public assemble(assemblyList: string[]): string[] {
    const machineCode: string[] = [];
    this.resolveLabelsAndDefines(assemblyList);

    for (let i = 0; i < assemblyList.length; i++) {
      const line = assemblyList[i].trim();
      const args = line.split(/\s+/);
      const opcode = args[0]?.toLowerCase();
      let assembled: string;

      if (opcode.startsWith('.')) continue; // Ignore labels

      if (opcode === 'define') {
        continue;
      }

      if (['ldi', 'adi', 'jid'].includes(opcode)) {
        assembled = this.immediateOperation(args);
        machineCode.push(assembled);
        continue;
      }

      if (['add', 'sub', 'nor', 'and', 'xor', 'adc'].includes(opcode)) {
        assembled = this.logicArithmeticOperation(args);
        machineCode.push(assembled);
        continue;
      }

      if (['lod', 'str'].includes(opcode)) {
        assembled = this.memoryOperation(args);
        machineCode.push(assembled);
        continue;
      }

      if (opcode === 'rsh') {
        assembled = this.rsh(args);
        machineCode.push(assembled);
        continue;
      }

      if (opcode === 'jmp') {
        assembled = this.jmp(args);
        machineCode.push(assembled);
        continue;
      }

      if (opcode === 'brh') {
        assembled = this.brh(args);
        machineCode.push(assembled);
        continue;
      }

      if (['hlt', 'nop'].includes(opcode)) {
        machineCode.push(`000000000000${this.symbolToBinary(args[0], 4)}`);
        continue;
      }

      if (opcode === 'cmp') {
        assembled = this.cmp(args);
        machineCode.push(assembled);
        continue;
      }

      if (opcode === 'mov') {
        assembled = this.mov(args);
        machineCode.push(assembled);
        continue;
      }

      if (opcode === 'lsh') {
        assembled = this.lsh(args);
        machineCode.push(assembled);
        continue;
      }

      if (['inc', 'dec'].includes(opcode)) {
        assembled = this.pseudoImmediate(args);
        machineCode.push(assembled);
        continue;
      }

      if (opcode === 'not') {
        assembled = this.not(args);
        machineCode.push(assembled);
        continue;
      }

      if (opcode === 'neg') {
        assembled = this.neg(args);
        machineCode.push(assembled);
        continue;
      }
    }

    return machineCode;
  }

  private resolveLabelsAndDefines(assemblyList: string[]): void {
    let currentAddress = 0;

    for (let i = 0; i < assemblyList.length; i++) {
      const line = assemblyList[i].trim();
      if (!line || line.startsWith('/') || line.startsWith('#')) continue;

      const tokens = line.split(/\s+/);
      const firstToken = tokens[0]?.toLowerCase();

      if (firstToken === 'define') {
        if (tokens.length !== 3) {
          continue;
        }
        const [, symbol, rawValue] = tokens;
        let value = rawValue;
        if (this.symbols.has(value.toLowerCase())) {
          value = this.symbols.get(value.toLowerCase())!.toString();
        }
        this.symbols.set(symbol.toLowerCase(), parseInt(value, 10));
        continue;
      }

      if (firstToken.startsWith('.')) {
        const labelName = firstToken.toLowerCase();
        if (this.labels.has(labelName)) {
          throw new Error(`Duplicate label definition: ${labelName}`);
        }
        this.labels.set(labelName, currentAddress);
        continue;
      }

      currentAddress++;
    }
  }

  private jmp(args: string[]): string {
    const opcode = this.symbolToBinary(args[0], 4);
    const immediate = this.toBinary(args[1], 8);
    return `${immediate}0000${opcode}`;
  }

  private toBinary(value: string | number, bits: number): string {
    if (typeof value === 'string') {
      if (this.labels.has(value.toLowerCase())) {
        value = this.labels.get(value.toLowerCase())!;
      } else if (this.symbols.has(value.toLowerCase())) {
        value = this.symbols.get(value.toLowerCase())!;
      } else if (this.isNumeric(value)) {
        value = Number(value);
      } else {
        throw new Error(`Undefined label or invalid symbol: ${value}`);
      }
    }

    const binary = Number(value).toString(2);
    if (binary.length > bits) {
      throw new Error(`Value ${value} exceeds ${bits} bits limit`);
    }
    return binary.padStart(bits, '0');
  }

  private neg(args: string[]): string {
    const A = this.symbolToBinary('r0', 4);
    const B = this.symbolToBinary(args[2], 4);
    const C = this.symbolToBinary(args[1], 4);
    const opcode = this.symbolToBinary('sub', 4);
    return `${A}${B}${C}${opcode}`;
  }

  private pseudoImmediate(args: string[]): string {
    const opcode = this.symbolToBinary('adi', 4);
    const C = this.symbolToBinary(args[1], 4);
    let immediate: string;

    if (args[0].toLowerCase() === 'inc') {
      immediate = this.toBinary(1, 8);
    } else {
      const oneTwoComp = 0b11111111;
      immediate = this.toBinary(oneTwoComp, 8);
    }

    return `${immediate}${C}${opcode}`;
  }

  private not(args: string[]): string {
    const A = this.symbolToBinary(args[2], 4);
    const B = this.symbolToBinary('r0', 4);
    const C = this.symbolToBinary(args[1], 4);
    const opcode = this.symbolToBinary('nor', 4);
    return `${A}${B}${C}${opcode}`;
  }

  private lsh(args: string[]): string {
    const A = this.symbolToBinary(args[2], 4);
    const B = this.symbolToBinary(args[2], 4);
    const C = this.symbolToBinary(args[1], 4);
    const opcode = this.symbolToBinary('add', 4);
    return `${A}${B}${C}${opcode}`;
  }

  private cmp(args: string[]): string {
    const A = this.symbolToBinary(args[1], 4);
    const B = this.symbolToBinary(args[2], 4);
    const C = this.symbolToBinary('r0', 4);
    const opcode = this.symbolToBinary('sub', 4);
    return `${A}${B}${C}${opcode}`;
  }

  private mov(args: string[]): string {
    const A = this.symbolToBinary(args[2], 4);
    const B = this.symbolToBinary('r0', 4);
    const C = this.symbolToBinary(args[1], 4);
    const opcode = this.symbolToBinary('add', 4);
    return `${A}${B}${C}${opcode}`;
  }

  private brh(args: string[]): string {
    const opcode = this.symbolToBinary(args[0], 4);
    const condition = this.symbolToBinary(args[1], 4);
    const immediate = this.toBinary(args[2], 8);
    return `${immediate}${condition}${opcode}`;
  }

  private rsh(args: string[]): string {
    const opcode = this.symbolToBinary(args[0], 4);
    const regC = this.symbolToBinary(args[1], 4);
    const regA = this.symbolToBinary(args[2], 4);
    return `${regA}0000${regC}${opcode}`;
  }

  private memoryOperation(args: string[]): string {
    const opcode = this.symbolToBinary(args[0], 4);
    const regC = this.symbolToBinary(args[1], 4);
    const regA = this.symbolToBinary(args[2], 4);
    const immediate = this.toBinary(Number(args[3] || 0), 4);
    return `${regA}${immediate}${regC}${opcode}`;
  }

  private immediateOperation(args: string[]): string {
    const immediate = this.toBinary(args[2] || 0, 8);
    const reg = this.symbolToBinary(args[1], 4);
    const opcodeBinary = this.symbolToBinary(args[0], 4);
    return `${immediate}${reg}${opcodeBinary}`;
  }

  private logicArithmeticOperation(args: string[]): string {
    const regABin = this.symbolToBinary(args[2], 4);
    const regBBin = this.symbolToBinary(args[3], 4);
    const regCBin = this.symbolToBinary(args[1], 4);
    const opcodeBin = this.symbolToBinary(args[0], 4);
    return `${regABin}${regBBin}${regCBin}${opcodeBin}`;
  }

  private symbolToBinary(symbol: string, bits: number): string {
    const value = this.symbols.get(symbol.toLowerCase())!;
    return this.toBinary(value, bits);
  }

  private isNumeric(value: string): boolean {
    return !isNaN(Number(value));
  }

  public validateAssembly(assemblyList: string[]): ErrorInfo[] {
    const errors: ErrorInfo[] = [];

    this.labels.clear();
    this.symbols.clear();
    this.initializeSymbols();
    this.resolveLabelsAndDefines(assemblyList);

    for (let i = 0; i < assemblyList.length; i++) {
      const rawLine = assemblyList[i];
      const line = rawLine.trim();
      if (!line || line.startsWith('/') || line.startsWith('#')) {
        continue;
      }

      const args = line.split(/\s+/);
      const instruction = args[0].toLowerCase();

      // Label must be on its own
      if (instruction.startsWith('.')) {
        if (args.length > 1) {
          errors.push({
            line: i,
            message: `Invalid label syntax. Labels must be on their own: "${line}".`
          });
        }
        continue;
      }

      // DEFINE directive
      if (instruction === 'define') {
        if (args.length !== 3) {
          errors.push({
            line: i,
            message: `Invalid DEFINE syntax. Use: "DEFINE <SYMBOL> <VALUE>".`
          });
          continue;
        }
        const valueToken = args[2];
        if (!this.isNumeric(valueToken) && !this.symbols.has(valueToken.toLowerCase())) {
          errors.push({
            line: i,
            message: `Invalid DEFINE value: "${valueToken}".`
          });
        }
        continue;
      }

      // Invalid instruction
      if (!this.opcodes.includes(instruction)) {
        errors.push({
          line: i,
          message: `Invalid instruction: "${instruction}".`
        });
        continue;
      }

      // Argument count validation
      const actualArgs = args.length - 1;

      if (instruction === 'jid') {
        if (actualArgs < 1 || actualArgs > 2) {
          errors.push({
            line: i,
            message: `Instruction "jid" expects 1 or 2 argument(s) but received ${actualArgs}.`
          });
          continue;
        }
      } else if (instruction === 'lod' || instruction === 'str') {
        if (actualArgs < 2 || actualArgs > 3) {
          errors.push({
            line: i,
            message: `Instruction "${instruction}" expects 2 or 3 argument(s) but received ${actualArgs}.`
          });
          continue;
        }
      } else {
        const expected = this.getExpectedArguments(instruction);
        if (actualArgs !== expected) {
          errors.push({
            line: i,
            message: `Instruction "${instruction}" expects ${expected} argument(s) but received ${actualArgs}.`
          });
          continue;
        }
      }

      // Validate each argument: register, symbol, number, or label
      for (let k = 1; k < args.length; k++) {
        const tokenLower = args[k].toLowerCase();
        const isRegister = this.registers.includes(tokenLower);
        const isSymbol = this.symbols.has(tokenLower);
        const isLabel = this.labels.has(tokenLower);
        const isNumber = this.isNumeric(tokenLower);

        if (!isRegister && !isSymbol && !isLabel && !isNumber) {
          errors.push({
            line: i,
            message: `Invalid argument "${tokenLower}" for instruction "${instruction}" (position ${k}).`
          });
        }
      }
    }

    return errors;
  }

  private getExpectedArguments(instruction: string): number {
    const argumentCounts: { [key: string]: number } = {
      ldi: 2,
      adi: 2,
      add: 3,
      sub: 3,
      xor: 3,
      and: 3,
      nor: 3,
      brh: 2,
      jmp: 1,
      lod: 3,
      str: 3,
      mov: 2,
      cmp: 2,
      inc: 1,
      dec: 1,
      not: 2,
      neg: 2,
      lsh: 2,
      rsh: 2,
      jid: 2
    };
    return argumentCounts[instruction] || 0;
  }
}

export default Assembler;
