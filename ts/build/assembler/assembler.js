"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Assembler {
    constructor(asPath, mcPath) {
        this.opcodes = [
            'nop', 'hlt', 'add', 'sub',
            'nor', 'and', 'xor', 'rsh',
            'ldi', 'adi', 'jmp', 'brh',
            'jid', 'adc', 'lod', 'str',
            'cmp', 'mov', 'neg', 'not',
            'inc', 'dec', 'lsh'
        ];
        this.registers = [
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
        this.conditions1 = ['pos', 'neg', 'lt', 'ge', 'eq', 'ne', 'odd', 'even'];
        this.conditions2 = ['>0', '<0', '<', '>=', '=', '!=', '!%2', '%2'];
        this.conditions4 = ['notmsb', 'msb', 'notcarry', 'carry', 'zero', 'notzero', 'noteven', 'even'];
        this.ports = [
            'clear_sreen_buffer', 'buffer_screen', 'clear_pixel', 'draw_pixel',
            'pixel_x', 'pixel_y', 'number_display_low_8', 'number_display_high8'
        ];
        this.labels = new Map();
        this.symbols = new Map();
        this.asPath = asPath;
        this.mcPath = mcPath;
        this.initializeSymbols();
        this.filesMap = this.readAllFilesInAssemblyDir();
    }
    initializeSymbols() {
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
    isNumeric(value) {
        return !isNaN(Number(value));
    }
    readAndFilterFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const lines = data.split('\n');
            const filteredLines = lines.filter(line => {
                const trimmedLine = line.trim();
                return trimmedLine && !trimmedLine.startsWith('/') && !trimmedLine.startsWith('#');
            });
            return filteredLines;
        }
        catch (err) {
            console.error(`Error to Read File ${filePath}:`, err);
            return [];
        }
    }
    readAllFilesInAssemblyDir() {
        const assemblyDir = path.resolve(this.asPath);
        const fileLinesMap = new Map();
        try {
            const files = fs.readdirSync(assemblyDir);
            const asFiles = files.filter(file => path.extname(file) === '.as');
            asFiles.forEach(file => {
                const filePath = path.join(assemblyDir, file);
                const filteredLines = this.readAndFilterFile(filePath);
                fileLinesMap.set(file, filteredLines);
            });
        }
        catch (err) {
            console.error(`Error to Read File in Folder ${assemblyDir}:`, err);
        }
        return fileLinesMap;
    }
    assembleFiles() {
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
            }
            catch (err) {
                console.error(`Failed to assemble ${fileName}:`, err);
            }
        }
    }
    assemble(assemblyList) {
        var _a;
        const machineCode = [];
        this.resolveLabels(assemblyList);
        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
            const args = line.split(/\s+/);
            const opcode = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            let assembled;
            if (opcode.startsWith('.'))
                continue;
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
    neg(args) {
        const A = this.symbolToBinary('r0', 4);
        const B = this.symbolToBinary(args[2], 4);
        const C = this.symbolToBinary(args[1], 4);
        const opcode = this.symbolToBinary('sub', 4);
        return `${A}${B}${C}${opcode}`;
    }
    pseudoImmediate(args) {
        const opcode = this.symbolToBinary('adi', 4);
        const C = this.symbolToBinary(args[1], 4);
        let immediate;
        if (args[0].toLowerCase() === 'inc') {
            immediate = this.toBinary(1, 8);
        }
        else {
            const oneTwoComp = 0b11111111;
            immediate = this.toBinary(oneTwoComp, 8);
        }
        return `${immediate}${C}${opcode};`;
    }
    not(args) {
        const A = this.symbolToBinary('r0', 4);
        const B = this.symbolToBinary(args[2], 4);
        const C = this.symbolToBinary(args[1], 4);
        const opcode = this.symbolToBinary('nor', 4);
        return `${A}${B}${C}${opcode}`;
    }
    lsh(args) {
        const A = this.symbolToBinary(args[2], 4);
        const B = this.symbolToBinary(args[2], 4);
        const C = this.symbolToBinary(args[1], 4);
        const opcode = this.symbolToBinary('add', 4);
        return `${A}${B}${C}${opcode}`;
    }
    cmp(args) {
        const A = this.symbolToBinary(args[1], 4);
        const B = this.symbolToBinary(args[2], 4);
        const C = this.symbolToBinary('r0', 4);
        const opcode = this.symbolToBinary('sub', 4);
        return `${A}${B}${C}${opcode}`;
    }
    mov(args) {
        const A = this.symbolToBinary(args[2], 4);
        const B = this.symbolToBinary('r0', 4);
        const C = this.symbolToBinary(args[1], 4);
        const opcode = this.symbolToBinary('add', 4);
        return `${A}${B}${C}${opcode}`;
    }
    brh(args) {
        const opcode = this.symbolToBinary(args[0], 4);
        const condition = this.symbolToBinary(args[2], 4);
        const immediate = this.toBinary(args[1], 8);
        return `${immediate}${condition}${opcode}`;
    }
    jmp(args) {
        const opcode = this.symbolToBinary(args[0], 4);
        const immediate = this.toBinary(args[1], 8);
        return `${immediate}${'0000'}${opcode}`;
    }
    rsh(args) {
        const opcode = this.symbolToBinary(args[0], 4);
        const regC = this.symbolToBinary(args[1], 4);
        const regA = this.symbolToBinary(args[2], 4);
        return `${regA}${'0000'}${regC}${opcode}`;
    }
    memoryOperation(args) {
        const opcode = this.symbolToBinary(args[0], 4);
        const regC = this.symbolToBinary(args[1], 4);
        const regA = this.symbolToBinary(args[2], 4);
        const immediate = this.toBinary(Number(args[3]), 4);
        return `${regA}${immediate}${regC}${opcode}`;
    }
    immediateOperation(args) {
        const immediate = this.toBinary(Number(args[2]), 8);
        const reg = this.symbolToBinary(args[1], 4);
        const opcodeBinary = this.symbolToBinary(args[0], 4);
        const assembled = `${immediate}${reg}${opcodeBinary}`;
        return assembled;
    }
    logicArithmeticOperation(args) {
        const regABin = this.symbolToBinary(args[2], 4);
        const regBBin = this.symbolToBinary(args[3], 4);
        const regCBin = this.symbolToBinary(args[1], 4);
        const opcodeBin = this.symbolToBinary(args[0], 4);
        const assembled = `${regABin}${regBBin}${regCBin}${opcodeBin}`;
        return assembled;
    }
    validate(assemblyList) {
        var _a;
        const errors = [];
        const definedLabels = new Set();
        const usedLabels = new Set();
        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
            if (!line || line.startsWith('/') || line.startsWith('#'))
                continue;
            const tokens = line.split(/\s+/);
            const opcodeOrLabel = (_a = tokens[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (opcodeOrLabel.startsWith('.')) {
                const labelName = opcodeOrLabel;
                if (definedLabels.has(labelName)) {
                    errors.push({
                        line: i,
                        message: `Duplicate label definition: ${labelName}`
                    });
                }
                else {
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
    validateLDI(tokens, line, errors) {
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
        }
        else {
            const value = Number(immediate);
            if (value < 0 || value > 255) {
                errors.push({
                    line,
                    message: `Immediate value out of range (0-255): ${immediate}`
                });
            }
        }
    }
    validateJMP(tokens, line, usedLabels, errors) {
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
        }
        else {
            usedLabels.add(label.toLowerCase());
        }
    }
    validateBRH(tokens, line, usedLabels, errors) {
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
        }
        else {
            usedLabels.add(label.toLowerCase());
        }
        if (!this.conditions4.includes(condition)) {
            errors.push({
                line,
                message: `Invalid condition for BRH: ${condition}`
            });
        }
    }
    validateGeneric(tokens, line, errors) {
        const opcode = tokens[0].toLowerCase();
        const expectedArgs = this.getExpectedArguments(opcode);
        if (tokens.length - 1 < expectedArgs) {
            errors.push({
                line,
                message: `Not enough arguments for ${opcode}: expected ${expectedArgs}, got ${tokens.length - 1}`
            });
        }
    }
    getExpectedArguments(opcode) {
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
    resolveLabels(assemblyList) {
        let currentAddress = 0;
        for (let i = 0; i < assemblyList.length; i++) {
            const line = assemblyList[i].trim();
            if (!line || line.startsWith('/') || line.startsWith('#'))
                continue;
            const tokens = line.split(/\s+/);
            if (tokens[0].startsWith('.')) {
                const labelName = tokens[0].toLowerCase();
                this.labels.set(labelName, currentAddress);
                continue;
            }
            currentAddress++;
        }
    }
    toBinary(value, bits) {
        if (typeof value === 'string') {
            if (this.labels.has(value.toLowerCase())) {
                value = this.labels.get(value.toLowerCase());
            }
            else {
                throw new Error(`Undefined label: ${value}`);
            }
        }
        const binary = Number(value).toString(2);
        if (binary.length > bits) {
            throw new Error(`Value ${value} exceeds the limit of ${bits} bits`);
        }
        return binary.padStart(bits, '0');
    }
    symbolToBinary(symbol, bits) {
        const value = this.symbols.get(symbol.toLowerCase());
        if (value === undefined) {
            throw new Error(`Symbol not found: ${symbol}`);
        }
        return this.toBinary(value, bits);
    }
}
exports.Assembler = Assembler;
