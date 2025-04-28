interface ErrorInfo {
    line: number,
    message: string
}

export class Assembler {

    private opcodes = [
        'nop', 'hlt', 'add', 'sub',
        'nor', 'and', 'xor', 'rsh',
        'ldi', 'adi', 'jmp', 'brh', 
        'jid', 'adc', 'lod', 'str',
        'cmp', 'mov', 'neg', 'not',
        'inc', 'dec' , 'lsh'
    ];
    
    private registers = [
        'r0', 'r1', 'r2', 'r3', 
        'r4', 'r5', 'r6', 'r7', 
        'r8', 'r9', 'r10', 'r11',
        'r12', 'r13', 'r14', 'r15'
    ];

    // 000 - NOT MSB | Positive (>0)
    // 001 - MSB  | Negative (<0)
    // 010 - NOT COUT  | Less Than (C==false)
    // 011 - COUT | Greater Than or Equal (c==true)
    // 100 - ZERO | Equal (Z==true)
    // 101 - NOT ZERO | Not Equal (z==false)
    // 110 - NOT EVEN | odd (%2 == 1)
    // 111 - EVEN (%2 == 0)

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
        this.resolveLabelsAndDefines(assemblyList); // Resolve labels e define
    
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
                let [def, symbol, value] = tokens;
            
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
    
            // Increment address for instructions
            currentAddress++;
        }
    }
    
    private jmp(args: string[]): string {
        const opcode = this.symbolToBinary(args[0], 4);
        const immediate = this.toBinary(args[1], 8); // Resolve to label, define, or literal        
        return `${immediate}0000${opcode}`;
    }
    
    private toBinary(value: string | number, bits: number): string {
        if (typeof value === 'string') {
            // Resolve labels
            if (this.labels.has(value.toLowerCase())) {
                value = this.labels.get(value.toLowerCase())!;
            } 
            // Resolve symbols or defines
            else if (this.symbols.has(value.toLowerCase())) {
                value = this.symbols.get(value.toLowerCase())!;
            } 
            // Check if numeric literal
            else if (this.isNumeric(value)) {
                value = Number(value);
            } 
            else {
                throw new Error(`Undefined label or invalid value: ${value}`);
            }
        }
    
        const binary = Number(value).toString(2);
        if (binary.length > bits) {
            throw new Error(`Value ${value} exceeds the limit of ${bits} bits`);
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

    private not(args: string[]): string{
        const A = this.symbolToBinary(args[2], 4);
        const B = this.symbolToBinary('r0', 4);
        const C = this.symbolToBinary(args[1], 4);
        const opcode = this.symbolToBinary('nor', 4);
        return `${A}${B}${C}${opcode}`
    }

    private lsh(args: string []): string{
        const A = this.symbolToBinary(args[2], 4);
        const B = this.symbolToBinary(args[2], 4);
        const C = this.symbolToBinary(args[1], 4);
        const opcode = this.symbolToBinary('add', 4);
        return `${A}${B}${C}${opcode}`
    }

    private cmp(args: string[]): string{
        const A = this.symbolToBinary(args[1], 4)
        const B = this.symbolToBinary(args[2], 4)
        const C = this.symbolToBinary('r0', 4);
        const opcode = this.symbolToBinary('sub', 4);
        return `${A}${B}${C}${opcode}`
    }

    private mov(args: string[]): string{
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
        return `${regA}${'0000'}${regC}${opcode}`;
    }

    private memoryOperation(args: string[]): string{
        const opcode = this.symbolToBinary(args[0], 4);
        const regC = this.symbolToBinary(args[1], 4)
        const regA = this.symbolToBinary(args[2], 4);
        const immediate = this.toBinary(Number(args[3] || 0 ), 4);
        return `${regA}${immediate}${regC}${opcode}`
    }

    private immediateOperation(args: string[]): string{
        const immediate = this.toBinary(args[2] || 0, 8); // Handle both numeric literals and defined symbols
        const reg = this.symbolToBinary(args[1], 4);
        const opcodeBinary = this.symbolToBinary(args[0], 4);
        const assembled = `${immediate}${reg}${opcodeBinary}`;
        return assembled;
    }

    private logicArithmeticOperation(args: string[]): string{
        const regABin = this.symbolToBinary(args[2], 4);
        const regBBin = this.symbolToBinary(args[3], 4);
        const regCBin = this.symbolToBinary(args[1], 4);
        const opcodeBin = this.symbolToBinary(args[0], 4);
        const assembled = `${regABin}${regBBin}${regCBin}${opcodeBin}`;
        return assembled;
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
    
        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
    
            // Ignore empty lines and comments
            if (!line || line.startsWith('/') || line.startsWith('#')) continue;
    
            const args = line.split(/\s+/);
            const instruction = args[0]?.toLowerCase();
    
            // Check for invalid instructions
            if (!this.opcodes.includes(instruction) && instruction !== 'define' && !instruction.startsWith('.')) {
                errors.push({
                    line: i,
                    message: `Invalid instruction: ${instruction}`,
                });
                continue;
            }
    
            // Check DEFINE
            if (instruction === 'define') {
                if (args.length < 3) {
                    errors.push({
                        line: i,
                        message: `Invalid DEFINE syntax. Expected: "DEFINE SYMBOL VALUE"`,
                    });
                } else if (isNaN(Number(args[2])) && !this.symbols.has(args[2].toLowerCase())) {
                    errors.push({
                        line: i + 1,
                        message: `Invalid DEFINE value: ${args[2]}`,
                    });
                }
                continue;
            }
    
            // Check labels
            if (instruction.startsWith('.')) {
                if (args.length > 1) {
                    errors.push({
                        line: i + 1,
                        message: `Invalid label syntax. Labels should be standalone.`,
                    });
                }
                continue;
            }
    
            // Check arguments based on the instruction
            const opcodeIndex = this.opcodes.indexOf(instruction);
            if (opcodeIndex !== -1) {
                const expectedArgs = this.getExpectedArguments(instruction);
    
                if (args.length  - 1 < expectedArgs) {
                    errors.push({
                        line: i,
                        message: `Instruction "${instruction}" expects ${expectedArgs} arguments but got ${args.length - 1}.`,
                    });
                }
    
                // Check for invalid registers or symbols
                args.slice(1).forEach((arg, index) => {
                    if (!this.registers.includes(arg.toLowerCase()) &&
                        !this.symbols.has(arg.toLowerCase()) &&
                        !this.isNumeric(arg)) {
                        errors.push({
                            line: i + 1,
                            message: `Invalid argument "${arg}" for instruction "${instruction}" at position ${index + 1}.`,
                        });
                    }
                });
            }
        }
    
        return errors;
    }
    
    private getExpectedArguments(instruction: string): number {
        // Define the expected number of arguments for each instruction
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
            jid: 2,
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
        };
    
        return argumentCounts[instruction] || 0;
    }
    
}

export default Assembler;