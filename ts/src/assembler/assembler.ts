import { FileManager } from './fileManager';

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
        'pixel_x', 'pixel_y', 'number_display_low_8', 'number_display_high8'
    ];

    private labels = new Map<string, number>();
    private symbols = new Map<string, number>();
    private assemblyFiles: Map<string, string[]> = new Map<string, string[]>();
    private filesAssembled: Map<string, string[]> = new Map<string, string[]>();

    constructor() {
        this.initializeSymbols();
    }

    public getAssemblyFiles(): Map<string, string[]> {
        return this.assemblyFiles;
    }

    public setAssemblyFiles(files: Map<string, string[]>): void {
        this.assemblyFiles = files;
    }

    public getFilesAssembled(): Map<string, string[]> {
        return this.filesAssembled;
    }

    public setFilesAssembled(files: Map<string, string[]>): void {
        this.filesAssembled = files;
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

    // public assembleFiles(): void {
    //     const assemblyFiles = this.fileManager.getLines();
    //     const assembledFiles = new Map<string, string[]>();
    
    //     assemblyFiles.forEach((lines, fileName) => {
    //         const filteredLines = lines.filter(line => {
    //             const trimmedLine = line.trim();
    //             return trimmedLine && !trimmedLine.startsWith('/') && !trimmedLine.startsWith('#');
    //         });
    
    //         const errors = this.validate(filteredLines);
    //         if (errors.length > 0) {
    //             console.error(`Errors found in file ${fileName}:`);
    //             errors.forEach(error => console.error(`Line ${error.line + 1}: ${error.message}`));
    //             return;
    //         }
    
    //         const machineCode = this.assemble(filteredLines);
    //         assembledFiles.set(fileName.replace('.as', '.mc'), machineCode);
    //     });
    
    //     this.fileManager.setLines(assembledFiles);
    
    //     console.log('Assembly process completed successfully!');
    // }
    

    public assemble(assemblyList: string[]): string[]{
        const machineCode: string[] = [];
        this.resolveLabels(assemblyList);
    
        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
            const args = line.split(/\s+/); 
            const opcode = args[0]?.toLowerCase();
            let assembled: string;

            if (opcode.startsWith('.')) continue;
    
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

            if(['lod', 'str'].includes(opcode)){
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

            if (['hlt' , 'nop'].includes(opcode)){
                machineCode.push(`000000000000${this.symbolToBinary(args[0], 4)}`)
            }

            if(opcode === 'cmp'){
                assembled = this.cmp(args);
                machineCode.push(assembled);
                continue;
            }

            if(opcode === 'mov'){
                assembled = this.mov(args);
                machineCode.push(assembled);
                continue;
            }

            if(opcode === 'lsh'){
                assembled = this.lsh(args);
                machineCode.push(assembled);
                continue; 
            }

            if(['inc', 'dec'].includes(opcode)){
                assembled = this.pseudoImmediate(args);
                machineCode.push(assembled);
                continue; 
            }

            if (opcode === 'not'){
                assembled = this.not(args);
                machineCode.push(assembled);
                continue; 
            }

            if (opcode === 'neg'){
                assembled = this.neg(args);
                machineCode.push(assembled);
                continue; 
            }
        }
        return machineCode
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
    
        return `${immediate}${C}${opcode};`;
    }

    private not(args: string[]): string{
        const A = this.symbolToBinary('r0', 4);
        const B = this.symbolToBinary(args[2], 4);
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
        const condition = this.symbolToBinary(args[2], 4);
        const immediate = this.toBinary(args[1], 8);
        return `${immediate}${condition}${opcode}`;
    }

    private jmp(args: string[]): string {
        const opcode = this.symbolToBinary(args[0], 4);
        const immediate = this.toBinary(args[1], 8);
        return `${immediate}${'0000'}${opcode}`;
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
        const immediate = this.toBinary(Number(args[3]), 4);
        return `${regA}${immediate}${regC}${opcode}`
    }

    private immediateOperation(args: string[]): string{
        const immediate = this.toBinary(Number(args[2]), 8);
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

    private validate(assemblyList: string[]): ErrorInfo[] {
        const errors: ErrorInfo[] = [];
        const definedLabels = new Set<string>();
        const usedLabels = new Set<string>();
    
        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
    
            if (!line || line.startsWith('/') || line.startsWith('#')) continue;
    
            const tokens = line.split(/\s+/);
            const opcodeOrLabel = tokens[0]?.toLowerCase();
    
            if (opcodeOrLabel.startsWith('.')) {
                const labelName = opcodeOrLabel;
                if (definedLabels.has(labelName)) {
                    errors.push({
                        line: i,
                        message: `Duplicate label definition: ${labelName}`
                    });
                } else {
                    definedLabels.add(labelName);
                }
                continue;
            }
    
            const opcode = opcodeOrLabel;
            if (!this.opcodes.includes(opcode)) {
                errors.push({
                    line: i,
                    message: `Unknown opcode: ${opcode}`
                });
                continue;
            }
    
            switch (opcode) {
                case 'ldi':
                    this.validateLDI(tokens, i, errors);
                    break;
    
                case 'jmp':
                    this.validateJMP(tokens, i, usedLabels, errors);
                    break;
    
                case 'brh':
                    this.validateBRH(tokens, i, usedLabels, errors);
                    break;
    
                default:
                    this.validateGeneric(tokens, i, errors);
                    break;
            }
        }
    
        for (const label of usedLabels) {
            if (!definedLabels.has(label)) {
                errors.push({
                    line: -1,
                    message: `Undefined label: ${label}`
                });
            }
        }
    
        return errors;
    }
    
    
    private validateLDI(tokens: string[], line: number, errors: ErrorInfo[]): void {
        if (tokens.length < 3) {
            errors.push({
                line,
                message: 'Not enough arguments for LDI: <LDI> <Reg> <Immediate>'
            });
            return;
        }
    
        const register = tokens[1];
        const immediate = tokens[2];
    
        if (!this.registers.includes(register)) {
            errors.push({
                line,
                message: `Invalid register: ${register}`
            });
        }
    
        if (!this.isNumeric(immediate)) {
            errors.push({
                line,
                message: `Invalid immediate value: ${immediate}`
            });
        } else {
            const value = Number(immediate);
            if (value < 0 || value > 255) {
                errors.push({
                    line,
                    message: `Immediate value out of range (0-255): ${immediate}`
                });
            }
        }
    }

    private validateJMP(tokens: string[], line: number, usedLabels: Set<string>, errors: ErrorInfo[]): void {
        if (tokens.length < 2) {
            errors.push({
                line,
                message: 'Not enough arguments for JMP: <JMP> <Label>'
            });
            return;
        }
    
        const label = tokens[1];
        if (!label.startsWith('.')) {
            errors.push({
                line,
                message: `Invalid label reference: ${label}`
            });
        } else {
            usedLabels.add(label.toLowerCase());
        }
    }
    
    private validateBRH(tokens: string[], line: number, usedLabels: Set<string>, errors: ErrorInfo[]): void {
        if (tokens.length < 3) {
            errors.push({
                line,
                message: 'Not enough arguments for BRH: <BRH> <Label> <Condition>'
            });
            return;
        }
    
        const label = tokens[1];
        const condition = tokens[2];
    
        if (!label.startsWith('.')) {
            errors.push({
                line,
                message: `Invalid label reference: ${label}`
            });
        } else {
            usedLabels.add(label.toLowerCase());
        }
    
        if (!this.conditions4.includes(condition)) {
            errors.push({
                line,
                message: `Invalid condition for BRH: ${condition}`
            });
        }
    }
    
    private validateGeneric(tokens: string[], line: number, errors: ErrorInfo[]): void {
        const opcode = tokens[0].toLowerCase();
    
        const expectedArgs = this.getExpectedArguments(opcode);
        if (tokens.length - 1 < expectedArgs) {
            errors.push({
                line,
                message: `Not enough arguments for ${opcode}: expected ${expectedArgs}, got ${tokens.length - 1}`
            });
        }
    }
    
    private getExpectedArguments(opcode: string): number {
        switch (opcode) {
            case 'add':
            case 'sub':
            case 'and':
            case 'xor':
            case 'nor':
            case 'adc':
                return 3;
            case 'inc':
            case 'dec': 
                return 1;
            case 'lod':
            case 'str':
                return 4;
            case 'rsh':
            case 'cmp': 
            case 'mov': 
            case 'neg':
            case 'not':
            case 'lsh':
                return 2;
            default:
                return 0;
        }
    }
    
    private resolveLabels(assemblyList: string[]): void {
        let currentAddress = 0;
    
        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
    
            if (!line || line.startsWith('/') || line.startsWith('#')) continue;
    
            const tokens = line.split(/\s+/);
    
            if (tokens[0].startsWith('.')) {
                const labelName = tokens[0].toLowerCase();
                this.labels.set(labelName, currentAddress);
                continue;
            }
    
            currentAddress++;
        }
    }

    private toBinary(value: string | number, bits: number): string {
        if (typeof value === 'string') {
            if (this.labels.has(value.toLowerCase())) {
                value = this.labels.get(value.toLowerCase())!;
            } else {
                throw new Error(`Undefined label: ${value}`);
            }
        }
    
        const binary = Number(value).toString(2);
        if (binary.length > bits) {
            throw new Error(`Value ${value} exceeds the limit of ${bits} bits`);
        }
        return binary.padStart(bits, '0');
    }
    
    private symbolToBinary(symbol: string, bits: number): string {
        const value = this.symbols.get(symbol.toLowerCase());
        if (value === undefined) {
            throw new Error(`Symbol not found: ${symbol}`);
        }
        return this.toBinary(value, bits);
    }   
    
    private isNumeric(value: string): boolean {
        return !isNaN(Number(value));
    }
}