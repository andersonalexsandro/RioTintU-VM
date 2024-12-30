import { log } from 'console';
import * as fs from 'fs';
import * as path from 'path';

interface ErrorInfo {
    line: number,
    message: string
}

export class Assembler {

    private opcodes = [
        'nop', 'hlt', 'add', 'sub',
        'nor', 'and', 'xor', 'rsh',
        'ldi', 'adi', 'jmp', 'brh', 
        'jid', 'adc', 'lod', 'str'
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
        'pixel_x', 'pixel_y', 'number_display_low_8', 'number_display_high8'
    ];

    private asPath: string;
    private mcPath: string;
    private symbols = new Map<string, number>();
    public filesMap: Map<string, string[]>;

    constructor(asPath: string, mcPath: string) {
        this.asPath = asPath;
        this.mcPath = mcPath;
        this.initializeSymbols();
        this.filesMap = this.readAllFilesInAssemblyDir();
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

    private isNumeric(value: string): boolean {
        return !isNaN(Number(value));
    }

    private readAndFilterFile(filePath: string): string[] {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const lines = data.split('\n');
            const filteredLines = lines.filter(line => {
                const trimmedLine = line.trim();
                return trimmedLine && !trimmedLine.startsWith('/') && !trimmedLine.startsWith('#');
            });
            return filteredLines;
        } catch (err) {
            console.error(`Error to Read File ${filePath}:`, err);
            return [];
        }
    }

    private readAllFilesInAssemblyDir(): Map<string, string[]> {
        const assemblyDir = path.resolve(this.asPath);
        const fileLinesMap = new Map<string, string[]>();

        try {
            const files = fs.readdirSync(assemblyDir);
            const asFiles = files.filter(file => path.extname(file) === '.as');

            asFiles.forEach(file => {
                const filePath = path.join(assemblyDir, file);
                const filteredLines = this.readAndFilterFile(filePath);
                fileLinesMap.set(file, filteredLines);
            });
        } catch (err) {
            console.error(`Error to Read File in Folder ${assemblyDir}:`, err);
        }

        return fileLinesMap;
    }

    public assembleFiles() {
        const assembledDir = path.resolve(this.mcPath);
    
        if (!fs.existsSync(assembledDir)) {
            fs.mkdirSync(assembledDir, { recursive: true });
        }
    
        for (const [fileName, assemblyList] of this.filesMap.entries()) {
            try {
                const errors = this.validate(assemblyList);
    
                if (errors.length > 0) {
                    console.error(`Errors found in file ${fileName}:`);
                    errors.forEach(error => console.error(`Line ${error.line + 1}: ${error.message}`));
                    continue;
                }
    
                const machineCode = this.assemble(assemblyList);
    
                const outputFileName = fileName.replace('.as', '.mc');
                const outputPath = path.join(assembledDir, outputFileName);
    
                fs.writeFileSync(outputPath, machineCode.join('\n'), 'utf8');
                console.log(`Successfully assembled ${fileName} to ${outputPath}`);
            } catch (err) {
                console.error(`Failed to assemble ${fileName}:`, err);
            }
        }
    }
    

    private assemble(assemblyList: string[]): string[]{
        const machineCode: string[] = [];
    
        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
            const args = line.split(/\s+/); 
            const opcode = args[0]?.toLowerCase();
            let assembled: string;
    
            if (['ldi', 'adi'].includes(opcode)) {
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

        }
        return machineCode
    }

    private memoryOperation(args: string[]): string{
        const opcode = this.symbolToBinary(args[0].toLowerCase(), 4);
        const regC = this.symbolToBinary(args[1], 4)
        const regA = this.symbolToBinary(args[2], 4);
        const immediate = this.toBinary(Number(args[3]), 4);
        return `${regA}${immediate}${regC}${opcode}`
    }

    private immediateOperation(args: string[]): string{
        const immediate = this.toBinary(Number(args[2]), 8);
        const reg = this.symbolToBinary(args[1], 4);
        const opcodeBinary = this.symbolToBinary(args[0].toLowerCase(), 4);
        const assembled = `${immediate}${reg}${opcodeBinary}`;
        return assembled;
    }

    private logicArithmeticOperation(args: string[]): string{
        const regABin = this.symbolToBinary(args[2], 4);
        const regBBin = this.symbolToBinary(args[3], 4);
        const regCBin = this.symbolToBinary(args[1], 4);
        const opcodeBin = this.symbolToBinary(args[0].toLowerCase(), 4);
        const assembled = `${regABin}${regBBin}${regCBin}${opcodeBin}`;
        return assembled;
    }

    private validate(assemblyList: string[]): ErrorInfo[]{
        const errors: ErrorInfo[] = [];

        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
            const args = line.split(/\s+/); 
            const opcode = args[0]?.toLowerCase();

            if (opcode === 'ldi') {
                const error = this.validateLDI(args, i);
                if (error) errors.push(error);
                continue;
            }
        }
        return errors
    }
    
    private validateLDI(args: string[], line: number): { line: number, message: string } | null {
        if (args.length < 3) {
            return { line, message: 'Not enough args: <LDI> <Reg> <Immediate>' };
        }
    
        const register = args[1];
        const immediate = args[2];
    
        if (!this.registers.includes(register)) {
            return { line, message: `Invalid register: ${register}` };
        }
    
        if (!this.isNumeric(immediate)) {
            return { line, message: `Invalid immediate value: ${immediate}` };
        }
    
        const immediateValue = Number(immediate);
        if (immediateValue < 0 || immediateValue > 255) {
            return { line, message: `Immediate value out of range (0-255): ${immediate}` };
        }
    
        return null;
    }    

    private toBinary(value: number, bits: number): string {
        if (value < 0) {
            throw new Error(`Value cannot be negative: ${value}`);
        }
        const binary = value.toString(2);
        if (binary.length > bits) {
            throw new Error(`Value ${value} exceeds the limit of ${bits} bits`);
        }
        return binary.padStart(bits, '0');
    }
    
    private symbolToBinary(symbol: string, bits: number): string {
        const value = this.symbols.get(symbol);
        if (value === undefined) {
            throw new Error(`Symbol not found: ${symbol}`);
        }
        return this.toBinary(value, bits);
    }    
}